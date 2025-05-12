const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../firebase');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.createUser({ email, password });
    const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const token = jwt.sign({ uid: decodedToken.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await auth.getUser(decoded.uid);
    res.json({ email: user.email, uid: user.uid });
  } catch (error) {
    res.status(401).json({ error: 'Недійсний токен' });
  }
});

module.exports = router;