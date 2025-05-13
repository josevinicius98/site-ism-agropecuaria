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
    { name: 'Dashboard Financeiro', url: 'https://app.powerbi.com/groups/me/apps/ca331862-4442-4a08-8636-2ec3aa5c7822/reports/95453353-a776-4abb-bbc3-2f46ae0590f0/ReportSection484dcc406711eeb9a09f?experience=power-bi' },
    { name: 'Dashboard Frotas', url: 'https://app.powerbi.com/groups/me/apps/a9de2b3f-3a97-4497-a01a-9f5082a484c7/reports/51a3ec79-04fb-43e8-8aae-080225d66a51/6d6fdd5ce67baf64b941?ctid=aa6e2e9e-1a1a-4eac-b484-76b2a98e4795&experience=power-bi' },
    { name: 'Dashboard Agricola', url: 'https://app.powerbi.com/groups/me/apps/a9de2b3f-3a97-4497-a01a-9f5082a484c7/reports/7b8958e5-a8c5-497a-af09-7fee07ac3cac/65e8d1df0b0a7eb3e51e?ctid=aa6e2e9e-1a1a-4eac-b484-76b2a98e4795&experience=power-bi' },
    { name: 'Dashboard Orçado', url: 'https://app.powerbi.com/groups/me/apps/a9de2b3f-3a97-4497-a01a-9f5082a484c7/reports/70454850-7bd2-4005-95fc-3508b5fd5559/0db9adccd79603d4e4c7?experience=power-bi' },
    { name: 'Dashboard Transportadora', url: 'https://app.powerbi.com/groups/me/apps/406b4a40-2f5f-4a88-968a-c7a9bde26cbf/reports/c6f2e082-9ae7-4ae1-a5f9-ce3f9145d502/ReportSection935ce63adf3c3cfe180d?experience=power-bi'},
    { name: 'Dashboard Checklist', url: 'https://app.powerbi.com/groups/me/apps/406b4a40-2f5f-4a88-968a-c7a9bde26cbf/reports/c6f2e082-9ae7-4ae1-a5f9-ce3f9145d502/ReportSection935ce63adf3c3cfe180d?experience=power-bi'},
    ]);
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
  console.log('API rodando em http://localhost:3001');
});
