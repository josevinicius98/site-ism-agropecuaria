// backend/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import cron from 'node-cron';
import cloudinary from 'cloudinary';

const app = express();

// --- Configuração CORS ---
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Multer para uploads
const upload = multer({ storage: multer.memoryStorage() });

// --- Cloudinary ---
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug MySQL
console.log(
  'DEBUG MySQL ENV:',
  process.env.MYSQLHOST,
  process.env.MYSQLUSER,
  process.env.MYSQLDATABASE,
  process.env.MYSQLPASSWORD ? 'senha OK' : 'SEM senha'
);

// Pool MySQL
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-para-dev';

// --- Middlewares ---
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.sub;
    req.role = decoded.role;
    req.user = decoded;
    next();
  });
}

function onlyRHorCompliance(req, res, next) {
  if (req.user && ['admin', 'rh', 'compliance'].includes(req.user.role)) return next();
  return res.status(403).json({ error: 'Acesso restrito.' });
}

// ROTA: Cadastro de usuário seguro (Mantém primeiro_login como TRUE por padrão do DB)
function onlyAdminRh(req, res, next) {
  if (req.user && ['admin','rh'].includes(req.user.role)) return next();
  return res.status(403).json({ error: 'Acesso restrito a admin e rh.' });
}

// Função para registrar auditoria
async function registrarAuditoria(usuarioId, acao, detalhes = '') {
  try {
    await pool.query(
      'INSERT INTO auditoria (usuario_id, acao, detalhes) VALUES (?, ?, ?)',
      [usuarioId, acao, detalhes]
    );
  } catch (e) {
    // Não bloqueie o fluxo principal por falha de auditoria!
    console.error('Erro ao registrar auditoria:', e);
  }
}

// --- Rota de auditoria ---
// Apenas admin e rh podem acessar os logs de auditoria
app.get('/api/auditoria', auth, onlyAdminRh, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.acao, a.detalhes, a.data_hora, u.nome AS usuario_nome, u.login
      FROM auditoria a
      JOIN users u ON a.usuario_id = u.id
      ORDER BY a.data_hora DESC
      LIMIT 200
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar logs de auditoria.' });
  }
});

// --- Cadastro de usuário ---
app.post('/api/cadastrar', async (req, res) => {
  try {
    const { nome, login, senha, role } = req.body;
    if (!nome || !login || !senha) {
      return res.status(400).json({ error: 'Nome, login e senha são obrigatórios' });
    }
    const hash = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO users (nome, login, senha_hash, role) VALUES (?, ?, ?, ?)',
      [nome, login, hash, role || 'colaborador']
    );
    // --- AUDITORIA: Cadastro de usuário (aqui usuário pode ser null, ou admin se tiver sessão)
    await registrarAuditoria(
      req.userId || null, // se for um admin, registra o id do admin, senão null
      'cadastro_usuario',
      `Usuário cadastrado: login=${login}, nome=${nome}, role=${role}`
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
// --- Login ---
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

    if (user.status_usuario === 'inativo') {
      return res.status(403).json({ error: 'Usuário inativo. Por favor, entre em contato com o suporte.' });
    }

    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    let isFirstLogin = user.primeiro_login;
    if (isFirstLogin && user.data_primeiro_login === null) {
      await pool.query('UPDATE users SET data_primeiro_login = NOW() WHERE id = ?', [user.id]);
      user.data_primeiro_login = new Date();
    }

    const token = jwt.sign(
      {
        sub: user.id,
        nome: user.nome,
        login: user.login,
        role: user.role,
        primeiro_login: isFirstLogin,
        status_usuario: user.status_usuario
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // --- AUDITORIA: login
    await registrarAuditoria(user.id, 'login', 'Usuário fez login no sistema.');

    return res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        login: user.login,
        role: user.role,
        primeiro_login: isFirstLogin
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// --- Alterar senha (primeiro login ou normal) ---
app.post('/api/alterar-senha', auth, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const userId = req.user.sub;

    if (!novaSenha) {
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

    // Se NÃO for primeiro login, senhaAtual é obrigatória!
    if (!userInDb.primeiro_login) {
      if (!senhaAtual) {
        return res.status(400).json({ error: 'A senha atual é obrigatória para alterar a senha.' });
      }
      const match = await bcrypt.compare(senhaAtual, userInDb.senha_hash);
      if (!match) {
        return res.status(401).json({ error: 'Senha atual incorreta.' });
      }
    }

    // Atualiza senha e marca como não-primeiro-login
    const novaHash = await bcrypt.hash(novaSenha, 10);
    await pool.query(
      'UPDATE users SET senha_hash = ?, primeiro_login = FALSE, status_usuario = "ativo" WHERE id = ?',
      [novaHash, userId]
    );

    // AUDITORIA: alteração de senha própria
    await registrarAuditoria(userId, 'alterar_senha', 'Usuário alterou a própria senha.');

    // Gera novo token atualizado
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
        primeiro_login: updatedUser.primeiro_login,
        status_usuario: updatedUser.status_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Senha alterada com sucesso.', token: newToken, user: updatedUser });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ error: 'Erro ao alterar senha.' });
  }
});

// Este job rodará todo dia à meia-noite (00:00)
// --- JOB: Inativar usuários que não trocaram a senha em 5 dias ---
cron.schedule('0 0 * * *', async () => {
  console.log('Executando job de inativação de usuários...');
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 5);
    const formattedDate = threeDaysAgo.toISOString().slice(0, 19).replace('T', ' ');
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
  timezone: "America/Sao_Paulo"
});

// --- Rotas protegidas admin/rh ---
// --- Listar todos usuários com todos os campos relevantes para a gestão ---
app.get('/api/users', auth, onlyAdminRh, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, login, role, status_usuario FROM users ORDER BY nome'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
});



app.patch('/api/users/:id/password', auth, onlyAdminRh, async (req, res) => {
  const targetId = req.params.id;
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres.' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET senha_hash = ? WHERE id = ?',
      [hash, targetId]
    );
    // AUDITORIA: admin/rh alterou senha de outro usuário
    await registrarAuditoria(req.user.sub, 'admin_alterar_senha', `Alterou a senha do user_id=${targetId}`);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao alterar senha do usuário.' });
  }
});

app.patch('/api/users/:id/status', auth, onlyAdminRh, async (req, res) => {
  const userId = req.params.id;
  const { status_usuario } = req.body;
  if (!['ativo', 'inativo'].includes(status_usuario)) {
    return res.status(400).json({ error: 'Status inválido' });
  }
  try {
    await pool.query(
      'UPDATE users SET status_usuario = ? WHERE id = ?',
      [status_usuario, userId]
    );
    // AUDITORIA: admin/rh ativou/inativou um usuário
    await registrarAuditoria(req.user.sub, 'alterar_status_usuario', `Alterou status do user_id=${userId} para ${status_usuario}`);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao atualizar status do usuário.' });
  }
});


// --- Denúncias ---
app.post('/api/denuncias', async (req, res) => {
  try {
    const { nome, categoria, descricao, anonimato } = req.body;
    await pool.query(
      'INSERT INTO denuncias (nome, categoria, descricao, anonimato) VALUES (?, ?, ?, ?)',
      [anonimato ? null : nome, categoria, descricao, anonimato ? 1 : 0]
    );
    // Auditoria apenas se não for anônimo e usuário estiver autenticado
    if (!anonimato && req.userId) {
      await registrarAuditoria(req.userId, 'nova_denuncia', `Categoria: ${categoria}`);
    }
    return res.status(201).json({ message: 'Denúncia registrada com sucesso' });
  } catch (err) {
    console.error('Erro ao processar denúncia:', err);
    return res.status(500).json({ error: 'Falha ao registrar denúncia' });
  }
});

// --- Atendimento (exemplo: adicionar outras rotas conforme seu projeto) ---
app.post('/api/atendimentos', auth, async (req, res) => {
  try {
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

// Listar atendimentos
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

// Listar mensagens de atendimento
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
    // AUDITORIA: envio mensagem no chat
    await registrarAuditoria(req.user.sub, 'enviar_mensagem', `Mensagem enviada no atendimento ${id}`);
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

// Gestão de denúncias
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

// Upload de arquivos em memória e Cloudinary
app.post('/api/atendimentos/:id/upload', auth, upload.single('arquivo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado.' });

  try {
    const atendimentoId = req.params.id;
    const remetente = ['admin', 'rh', 'compliance'].includes(req.role) ? 'suporte' : 'usuario';

    // Upload do arquivo para o Cloudinary
    const result = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: `ism-agropecuaria/atendimentos/${atendimentoId}`,
        resource_type: 'auto',
      }
    );

    const urlArquivo = result.secure_url;
    const nomeArquivo = req.file.originalname;

    await pool.query(
      'INSERT INTO mensagens_atendimento (atendimento_id, remetente, mensagem, tipo) VALUES (?, ?, ?, ?)',
      [atendimentoId, remetente, JSON.stringify({ url: urlArquivo, nome: nomeArquivo }), 'arquivo']
    );
    // AUDITORIA: upload de arquivo no chat
    await registrarAuditoria(req.user.sub, 'upload_arquivo', `Upload no atendimento ${atendimentoId}: ${nomeArquivo}`);
    res.json({ url: urlArquivo, nome: nomeArquivo });
  } catch (err) {
    console.error('Erro ao enviar arquivo para Cloudinary ou DB:', err);
    return res.status(500).json({ error: 'Erro ao processar upload de arquivo.' });
  }
});

// Rota para buscar dados do usuário autenticado
app.get('/api/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, login, role, primeiro_login, status_usuario FROM users WHERE id = ?',
      [req.user.sub]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar dados do usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
});

// Função para registrar auditoria
async function registrarAuditoria(usuarioId, acao, detalhes = '') {
  await pool.query(
    'INSERT INTO auditoria (usuario_id, acao, detalhes) VALUES (?, ?, ?)',
    [usuarioId, acao, detalhes]
  );
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

export default pool;
