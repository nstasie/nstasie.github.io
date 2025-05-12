const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { auth } = require('./firebase');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Токен відсутній' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await auth.getUser(decoded.uid);
    next();
  } catch (error) {
    console.error('Помилка автентифікації:', error);
    res.status(401).json({ error: 'Недійсний токен' });
  }
};

console.log('Підключення маршрутів /api/auth');
app.use('/api/auth', authRoutes);

console.log('Додавання маршруту /api/test');
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер працює!' });
});

console.log('Підключення маршрутів /api');
app.use('/api', authenticateToken, apiRoutes);

// Обробка всіх інших маршрутів для SPA
console.log('Додавання маршруту для всіх інших запитів');
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});