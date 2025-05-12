import React, { useState } from "react";
import Cart from "../components/Cart";
import { useNavigate } from "react-router-dom";

function CartPage({ cartItems, setCartItems, placeOrder, user }) {
  const [isCartVisible, setIsCartVisible] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const updateQuantity = (index, quantity) => {
    setCartItems(
      cartItems.map((item, i) =>
        i === index ? { ...item, quantity: quantity >= 1 ? quantity : 1 } : item
      )
    );
  };

  const removeFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const toggleCart = () => setIsCartVisible(!isCartVisible);

  const generateRandomOrderId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `№${randomNum}`;
  };

  const handleSubmit = async (name, phone) => {
    setError(null);
    setSuccess(null);

    // Перевірка кількості страв на клієнті
    const totalItemsCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (totalItemsCount < 1) {
      setError("Мінімум 1 страва потрібна для оформлення замовлення");
      return;
    }
    if (totalItemsCount > 10) {
      setError("Максимум 10 страв можна додати до замовлення");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (phone.length < 9) {
      setError("Введіть правильний номер телефону (мін. 9 цифр)");
      return;
    }

    const newOrderId = generateRandomOrderId();
    const currentDate = new Date().toLocaleDateString();
    const initialTimeLeft = 30 * 60; // 30 хвилин у секундах

    const newOrder = {
      orderId: newOrderId,
      date: currentDate,
      timeLeft: initialTimeLeft,
      items: cartItems,
      user: { name, phone, email: user.email },
      total,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Будь ласка, увійдіть, щоб оформити замовлення.");
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        throw new Error("Помилка при оформленні замовлення: " + response.statusText);
      }

      setCartItems([]); // Очищаємо кошик
      setSuccess("Замовлення успішно оформлено!");
      navigate('/orders'); // Перенаправляємо на сторінку "Мої замовлення"
    } catch (error) {
      console.error("Помилка:", error);
      setError(error.message);
    }
  };

  return (
    <Cart
      cartItems={cartItems}
      updateQuantity={updateQuantity}
      removeFromCart={removeFromCart}
      toggleCart={toggleCart}
      isCartVisible={isCartVisible}
      placeOrder={handleSubmit}
      user={user}
      error={error}
      success={success}
    />
  );
}

export default CartPage;