const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const SECRET_KEY = "supersecretadmin";
const JWT_SECRET = "your_jwt_secret";

// Enable CORS for your frontend domain
app.use(cors({
  origin: 'https://ecommerce-app-self-tau.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// JWT middleware to protect routes
const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(402).json({ message: "Invalid token" });
  }
};

// Protected route example
app.get("/admin/api/data", verifyJWT, (req, res) => {
  res.json({ message: "Protected route accessible" });
});

// Admin login route
app.post("/admin/login", (req, res) => {
  const { secret } = req.body;

  if (secret === SECRET_KEY) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      token,
      name: "admin",
      email: "admin@example.com"
    });
  } else {
    res.status(401).json({ message: "Invalid Secret" });
  }
});

// Use dynamic port for Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
