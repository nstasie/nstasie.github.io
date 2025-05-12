import React, { useEffect, useState } from "react";
import Orders from "../components/Orders";

function OrdersPage({ orders, setOrders, user }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState(null);

  // Завантажуємо замовлення з сервера
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Будь ласка, увійдіть, щоб переглянути замовлення.");
        }

        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Помилка при завантаженні замовлень: " + response.statusText);
        }

        const loadedOrders = await response.json();
        setOrders(loadedOrders);
      } catch (error) {
        console.error("Помилка:", error);
        setError(error.message);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, setOrders]);

  // Оновлення таймера і збереження на сервері
  useEffect(() => {
    const interval = setInterval(async () => {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order.timeLeft > 0
            ? { ...order, timeLeft: order.timeLeft - 1 }
            : order
        );

        // Оновлюємо сервер кожні 10 секунд, але без зайвих логів
        updatedOrders.forEach(async (order) => {
          if (order.timeLeft > 0 && order.timeLeft % 10 === 0 && order.id) {
            try {
              const token = localStorage.getItem('token');
              await fetch(`http://localhost:5000/api/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ timeLeft: order.timeLeft }),
              });
            } catch (error) {
              console.error("Помилка при оновленні часу:", error);
            }
          }
        });

        return updatedOrders;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setOrders]);

  return (
    <Orders
      orders={orders}
      expandedOrder={expandedOrder}
      setExpandedOrder={setExpandedOrder}
      user={user}
      error={error}
    />
  );
}

export default OrdersPage;