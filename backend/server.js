import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import cron from 'node-cron'; // Importar node-cron

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// -------- MULTER STORAGE COM EXTENSÃO ORIGINAL --------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });
// ------------------------------------------------------

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-para-dev';

// Middleware de autenticação
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.sub;
    req.role = decoded.role;
    // Adicionar 'primeiro_login' e 'status_usuario' ao req.user para facilitar acesso nos middlewares subsequentes
    req.user = decoded; // Adicionar o objeto decodificado completo
    next();
  });
}

// Middleware para RH/Admin/Compliance
function onlyRHorCompliance(req, res, next) {
  if (req.user && ['admin', 'rh', 'compliance'].includes(req.user.role)) return next();
  return res.status(403).json({ error: 'Acesso restrito.' });
}

// ROTA: Cadastro de usuário seguro (Mantém primeiro_login como TRUE por padrão do DB)
app.post('/api/cadastrar', async (req, res) => {
  try {
    const { nome, login, senha, role } = req.body;
    if (!nome || !login || !senha) {
      return res.status(400).json({ error: 'Nome, login e senha são obrigatórios' });
    }
    const hash = await bcrypt.hash(senha, 10);
    // As colunas primeiro_login, data_primeiro_login, status_usuario terão seus defaults do DB
    await pool.query(
      'INSERT INTO users (nome, login, senha_hash, role) VALUES (?, ?, ?, ?)',
      [nome, login, hash, role || 'colaborador']
    );
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Login já existe' });
    }
    console.error('Erro no cadastro:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// ROTA: Login seguro (Atualizado com lógica de primeiro_login e status_usuario)
app.post('/api/login', async (req, res) => {
  try {
    const { login, senha } = req.body;
    const [rows] = await pool.query(
      'SELECT id, nome, login, senha_hash, role, primeiro_login, data_primeiro_login, status_usuario FROM users WHERE login = ?',
      [login]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];

    // Verificar status do usuário
    if (user.status_usuario === 'inativo') {
      return res.status(403).json({ error: 'Usuário inativo. Por favor, entre em contato com o suporte.' });
    }

    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    let isFirstLogin = user.primeiro_login;
    // Se for o primeiro login e data_primeiro_login ainda não estiver definida, defina-a
    if (isFirstLogin && user.data_primeiro_login === null) {
      await pool.query(
        'UPDATE users SET data_primeiro_login = NOW() WHERE id = ?',
        [user.id]
      );
      // Atualizar o objeto user para refletir a mudança no banco de dados para o token
      user.data_primeiro_login = new Date();
    }

    const token = jwt.sign(
      {
        sub: user.id,
        nome: user.nome,
        login: user.login,
        role: user.role,
        primeiro_login: isFirstLogin, // Incluir no token para o frontend verificar
        status_usuario: user.status_usuario
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retorna o token e os dados do usuário para o frontend, incluindo o status de primeiro_login
    return res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        login: user.login,
        role: user.role,
        primeiro_login: isFirstLogin // Enviar o status para o frontend
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// ROTA: Alterar senha (Atualizada para marcar 'primeiro_login' como FALSE)
app.post('/api/alterar-senha', auth, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    // req.user foi adicionado pelo middleware auth
    const userId = req.userId; // Ou req.user.sub

    if (!novaSenha) { // senhaAtual pode ser opcional no primeiro login
      return res.status(400).json({ error: 'A nova senha é obrigatória.' });
    }

    const [rows] = await pool.query(
      'SELECT senha_hash, primeiro_login FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const userInDb = rows[0];

    // Se não for o primeiro login, a senha atual é obrigatória
    if (!userInDb.primeiro_login) {
      if (!senhaAtual) {
          return res.status(400).json({ error: 'A senha atual é obrigatória para alterar a senha.' });
      }
      const match = await bcrypt.compare(senhaAtual, userInDb.senha_hash);
      if (!match) {
        return res.status(401).json({ error: 'Senha atual incorreta.' });
      }
    }
    // Para o primeiro login, se você tem uma senha padrão e não a exige aqui,
    // o 'if (!userInDb.primeiro_login)' acima já trata isso.

    const novaHash = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha e define 'primeiro_login' para FALSE
    await pool.query(
      'UPDATE users SET senha_hash = ?, primeiro_login = FALSE, status_usuario = "ativo" WHERE id = ?',
      [novaHash, userId]
    );

    // Opcional: Re-gerar o token para o frontend já ter o 'primeiro_login: false' atualizado
    // Isso evita que o frontend precise fazer um novo login para atualizar o estado
    const [updatedUserRows] = await pool.query(
      'SELECT id, nome, login, role, primeiro_login, status_usuario FROM users WHERE id = ?',
      [userId]
    );
    const updatedUser = updatedUserRows[0];
    const newToken = jwt.sign(
      {
        sub: updatedUser.id,
        nome: updatedUser.nome,
        login: updatedUser.login,
        role: updatedUser.role,
        primeiro_login: updatedUser.primeiro_login, // Agora será FALSE
        status_usuario: updatedUser.status_usuario
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );


    res.json({ message: 'Senha alterada com sucesso.', token: newToken, user: updatedUser });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ error: 'Erro ao alterar senha.' });
  }
});


// JOB AGENDADO: Inativar usuários que não alteraram a senha em 3 dias
// Este job rodará todo dia à meia-noite (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Executando job de inativação de usuários...');
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 5); // 5 dias atrás       
    const formattedDate = threeDaysAgo.toISOString().slice(0, 19).replace('T', ' '); // Formato MySQL DATETIME

    const [result] = await pool.query(
      `UPDATE users
       SET status_usuario = 'inativo'
       WHERE primeiro_login = TRUE
         AND status_usuario = 'ativo'
         AND data_primeiro_login IS NOT NULL
         AND data_primeiro_login < ?`,
      [formattedDate]
    );
    console.log(`Job de inativação: ${result.changedRows} usuários inativados.`);
  } catch (err) {
    console.error('Erro no job de inativação de usuários:', err);
  }
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo" // Defina o fuso horário para Frutal/MG
});

// Outras Rotas (sem alterações significativas para esta funcionalidade)

// Cadastro de denúncia (aberto)
app.post('/api/denuncias', async (req, res) => {
  try {
    const { nome, categoria, descricao, anonimato } = req.body;
    await pool.query(
      'INSERT INTO denuncias (nome, categoria, descricao, anonimato) VALUES (?, ?, ?, ?)',
      [anonimato ? null : nome, categoria, descricao, anonimato ? 1 : 0]
    );
    return res.status(201).json({ message: 'Denúncia registrada com sucesso' });
  } catch (err) {
    console.error('Erro ao processar denúncia:', err);
    return res.status(500).json({ error: 'Falha ao registrar denúncia' });
  }
});

// Criar novo atendimento (se não houver aberto)
app.post('/api/atendimentos', auth, async (req, res) => {
  try {
    // verifica se já existe atendimento aberto desse usuário
    const [abertos] = await pool.query(
      'SELECT id FROM atendimentos WHERE usuario_id = ? AND status = "aberto"', [req.userId]
    );
    if (abertos.length > 0) return res.json({ atendimentoId: abertos[0].id });

    const [result] = await pool.query(
      'INSERT INTO atendimentos (usuario_id) VALUES (?)', [req.userId]
    );
    res.json({ atendimentoId: result.insertId });
  } catch (err) {
    console.error('Erro ao criar atendimento:', err);
    res.status(500).json({ error: 'Erro ao criar atendimento.' });
  }
});

// Listar atendimentos do usuário (ou todos, se admin/rh/compliance)
app.get('/api/atendimentos', auth, async (req, res) => {
  try {
    let query = `
      SELECT a.*, u.nome as nome_usuario
      FROM atendimentos a
      JOIN users u ON a.usuario_id = u.id
      ORDER BY
        CASE WHEN a.status = 'aberto' THEN 0 ELSE 1 END,
        a.id DESC
    `;
    let params = [];
    if (!['admin', 'rh', 'compliance'].includes(req.role)) {
      query = `
        SELECT a.*, u.nome as nome_usuario
        FROM atendimentos a
        JOIN users u ON a.usuario_id = u.id
        WHERE usuario_id = ?
        ORDER BY
          CASE WHEN a.status = 'aberto' THEN 0 ELSE 1 END,
          a.id DESC
      `;
      params = [req.userId];
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar atendimentos:', err);
    res.status(500).json({ error: 'Erro ao buscar atendimentos.' });
  }
});
// Detalhes de um atendimento específico

// Listar mensagens de um atendimento
app.get('/api/atendimentos/:id/mensagens', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const [msgs] = await pool.query(
      'SELECT * FROM mensagens_atendimento WHERE atendimento_id = ? ORDER BY enviado_em ASC',
      [id]
    );
    res.json(msgs);
  } catch (err) {
    console.error('Erro ao buscar mensagens:', err);
    res.status(500).json({ error: 'Erro ao buscar mensagens.' });
  }
});

// Enviar mensagem no chat do atendimento
app.post('/api/atendimentos/:id/mensagens', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { mensagem } = req.body;
    const remetente = ['admin', 'rh', 'compliance'].includes(req.role) ? 'suporte' : 'usuario';
    await pool.query(
      'INSERT INTO mensagens_atendimento (atendimento_id, remetente, mensagem) VALUES (?, ?, ?)',
      [id, remetente, mensagem]
    );
    res.status(201).json({ message: 'Mensagem enviada.' });
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
});

// Fechar atendimento
app.post('/api/atendimentos/:id/fechar', auth, async (req, res) => {
  try {
    await pool.query('UPDATE atendimentos SET status = "fechado" WHERE id = ?', [req.params.id]);
    res.json({ message: 'Atendimento fechado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fechar atendimento.' });
  }
});

// Rota protegida para gestão de denúncias
app.get('/api/admin/denuncias', auth, onlyRHorCompliance, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, categoria, descricao, anonimato, criado_em, status FROM denuncias ORDER BY criado_em DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar denúncias:', err);
    res.status(500).json({ error: 'Erro ao buscar denúncias.' });
  }
});


// ----------- ROTA DE UPLOAD DE ARQUIVOS COM EXTENSÃO CORRETA ----------
app.post('/api/atendimentos/:id/upload', auth, upload.single('arquivo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado.' });

  const atendimentoId = req.params.id;
  const remetente = ['admin', 'rh', 'compliance'].includes(req.role) ? 'suporte' : 'usuario';
  const urlArquivo = `/uploads/${req.file.filename}`;
  const nomeArquivo = req.file.originalname;

  await pool.query(
    'INSERT INTO mensagens_atendimento (atendimento_id, remetente, mensagem, tipo) VALUES (?, ?, ?, ?)',
    [atendimentoId, remetente, JSON.stringify({ url: urlArquivo, nome: nomeArquivo }), 'arquivo']
  );
  res.json({ url: urlArquivo, nome: nomeArquivo });
});
// ----------------------------------------------------------------------

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
