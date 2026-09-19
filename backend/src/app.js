const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const prisma = require('./config/database');

const app = express();

app.use(helmet());
app.disable('x-powered-by');

const requestLog = require('./middleware/requestLog');
app.use('/api/v1/signalements', requestLog);

// Sink des erreurs JS du navigateur (diagnostic crash page blanche).
// Limité en débit : endpoint public, spammable sinon.
const { rateLimit } = require('express-rate-limit');
const errorSink = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { detail: 'Trop de requêtes. Réessayez plus tard.' }
});
app.get('/api/error', errorSink, async (req, res) => {
  try {
    const stack = (req.query.stack || '').slice(0, 4000);
    const cstack = (req.query.componentStack || '').slice(0, 4000);
    const url = (req.query.url || '').slice(0, 200);
    const body = [stack, cstack ? `[COMPONENT]\n${cstack}` : '', url ? `[URL] ${url}` : ''].filter(Boolean).join('\n');
    await prisma.$executeRawUnsafe(
      "INSERT INTO request_log (method, path, ua, body) VALUES ($1, $2, $3, $4)",
      'JSERR', (req.query.msg || '?').slice(0, 200), (req.headers['user-agent'] || '').slice(0, 120), body
    );
  } catch { /* best-effort */ }
  res.status(204).end();
});

app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => res.json({ application: 'ECOMER', version: '3.0.0', stack: 'Express + Prisma + PostgreSQL', message: 'API opérationnelle' }));
app.get('/health', (req, res) => res.json({ status: 'ok', database: 'Prisma/PostgreSQL' }));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/signalements', require('./routes/signalements'));
app.use('/api/v1/upload', require('./routes/upload'));
app.use('/api/v1/zones', require('./routes/zones'));
app.use('/api/v1/appels-offres', require('./routes/appelsOffres'));
app.use('/api/v1/operations', require('./routes/operations'));
app.use('/api/v1/ecoshop', require('./routes/ecoshop'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));
app.use('/api/v1/stats', require('./routes/stats'));
app.use('/api/v1/recycleurs', require('./routes/recycleurs'));
app.use('/api/v1/equipes', require('./routes/equipes'));
app.use('/api/v1/gamification', require('./routes/gamification'));
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/geo', require('./routes/geo'));

app.use((req, res) => res.status(404).json({ detail: 'Route introuvable.' }));
app.use(errorHandler);

module.exports = app;