const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = "supersecretadmin";
const JWT_SECRET = "your_jwt_secret";

const allowedOrigins = ['https://ecommerce-app-self-tau.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

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

app.get("/admin/api/data", verifyJWT, (req, res) => {
  res.json({ message: "Protected route accessible" });
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
