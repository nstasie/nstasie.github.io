import React, { useState, useEffect } from "react";
import DishCard from "../components/DishCard";

function Menu({ addToCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState("Всі");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантажуємо пункти меню з API сервера
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token'); // Отримуємо токен із localStorage
        if (!token) {
          throw new Error("Будь ласка, увійдіть, щоб переглянути меню.");
        }

        const response = await fetch('http://localhost:5000/api/menu', {
          headers: {
            Authorization: `Bearer ${token}`, // Додаємо заголовок із токеном
          },
        });

        if (!response.ok) {
          throw new Error("Помилка при завантаженні меню: " + response.statusText);
        }

        const items = await response.json();
        setMenuItems(items);
        setLoading(false);
      } catch (error) {
        console.error("Помилка при завантаженні меню:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Фільтрація за категорією
  const filteredItems =
    category === "Всі"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  return (
    <section id="menu">
      <div className="filter-buttons">
        <button
          className={category === "Всі" ? "active" : ""}
          onClick={() => setCategory("Всі")}
        >
          Всі
        </button>
        <button
          className={category === "Піца" ? "active" : ""}
          onClick={() => setCategory("Піца")}
        >
          Піца
        </button>
        <button
          className={category === "Паста" ? "active" : ""}
          onClick={() => setCategory("Паста")}
        >
          Паста
        </button>
        <button
          className={category === "Боули" ? "active" : ""}
          onClick={() => setCategory("Боули")}
        >
          Боули
        </button>
        <button
          className={category === "Супи" ? "active" : ""}
          onClick={() => setCategory("Супи")}
        >
          Супи
        </button>
      </div>
      {loading ? (
        <p>Завантаження меню...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredItems.length > 0 ? (
        <div className="grid-container">
          {filteredItems.map((dish) => (
            <DishCard key={dish.id} dish={dish} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <p>Немає страв у цій категорії.</p>
      )}
    </section>
  );
}

export default Menu;