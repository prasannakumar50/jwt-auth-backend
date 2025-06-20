const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = "supersecretadmin";
const JWT_SECRET = "your_jwt_secret";

const allowedOrigins = ['https://ecommerce-app-self-tau.vercel.app'];

const corsOptions = {
  origin: 'https://ecommerce-app-self-tau.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

app.get('/admin/api/data', verifyJWT, (req, res) => {
  res.json({ message: "Protected route accessible" });
});

app.post('/admin/login', (req, res) => {
  const { secret } = req.body;

  if (secret === SECRET_KEY) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, name: 'admin', email: 'admin@example.com' });
  } else {
    res.status(401).json({ message: 'Invalid Secret' });
  }
});

// ✅ Optional dynamic admin route — only needed if frontend requests /admin/123
app.get('/admin/:id', (req, res) => {
  const adminId = req.params.id;
  res.json({ message: `You requested admin with ID: ${adminId}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
