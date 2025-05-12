// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const app = express();
// Habilita CORS apenas do front em dev
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Configuração do banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '06081998',
  database: 'portal_db',
});

// Carrega e valida o JWT_SECRET do ambiente
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET não definido em .env');
  process.exit(1);
}

// Rota de login (POST /api/login)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, password FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];
    // Comparação simples: senha pura x senha pura no banco
    const match = (password === user.password);
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Middleware de autenticação para rotas protegidas
function auth(req, res, next) {
  const authHeader = req.headers.authorization?.split(' ')[1];
  if (!authHeader) {
    return res.status(401).end();
  }

  jwt.verify(authHeader, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).end();
    }
    req.userId = payload.sub;
    next();
  });
}

// Rota protegida para obter links (GET /api/links)
app.get('/api/links', auth, (req, res) => {
  res.json([
    { name: 'Dashboard Financeiro', url: 'https://bi.exemplo.com/financeiro' },
    { name: 'Dashboard Vendas', url: 'https://bi.exemplo.com/vendas' },
  ]);
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log('API rodando em http://localhost:3001');
});
