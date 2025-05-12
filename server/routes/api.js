const express = require('express');
const { db } = require('../firebase');
const router = express.Router();

// GET /api/menu
router.get('/menu', async (req, res) => {
  try {
    const snapshot = await db.collection('menuItems').get();
    const menuItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders
router.get('/orders', async (req, res) => {
  try {
    const userEmail = req.user.email; // Отримуємо email із JWT-токена через authenticateToken
    const snapshot = await db.collection('orders')
      .where('user.email', '==', userEmail) // Фільтруємо за email користувача
      .get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders
router.post('/orders', async (req, res) => {
  const { items, user, total, orderId, date, timeLeft } = req.body;

  // Валідація вхідних даних
  if (!orderId || !date || !timeLeft || !items || !user || total === undefined) {
    console.error('Помилка валідації даних:', { orderId, date, timeLeft, items, user, total });
    return res.status(400).json({ error: 'Усі поля (orderId, date, timeLeft, items, user, total) обов’язкові' });
  }

  // Перевірка кількості страв
  if (!Array.isArray(items) || items.length < 1) {
    return res.status(400).json({ error: 'Мінімум 1 страва потрібна для оформлення замовлення' });
  }
  
  // Обчислюємо загальну кількість страв з урахуванням quantity
  const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (totalItemsCount > 10) {
    return res.status(400).json({ error: 'Максимум 10 страв можна додати до замовлення' });
  }

  try {
    const order = {
      orderId,
      date,
      total,
      timeLeft,
      items,
      user,
    };
    const docRef = await db.collection('orders').add(order);
    res.status(201).json({ id: docRef.id, ...order });
  } catch (error) {
    console.error('Помилка при створенні замовлення:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

// PUT /api/orders/:orderId
router.put('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { timeLeft } = req.body;

  if (timeLeft === undefined) {
    return res.status(400).json({ error: 'Поле timeLeft обов’язкове' });
  }

  try {
    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.update({ timeLeft });
    res.status(200).json({ message: 'Час оновлено' });
  } catch (error) {
    console.error('Помилка при оновленні замовлення:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

module.exports = router;