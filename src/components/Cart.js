import React, { useState } from "react";
import { Link } from "react-router-dom";

function Cart({
  cartItems,
  updateQuantity,
  removeFromCart,
  toggleCart,
  isCartVisible,
  placeOrder,
  user,
  error,
  success,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder(name, phone);
    setName("");
    setPhone("");
  };

  return (
    <section id="cart">
      <h2>Кошик</h2>
      <button id="toggle-cart" onClick={toggleCart}>
        {isCartVisible ? "Сховати кошик" : "Показати кошик"}
      </button>
      {isCartVisible && (
        <>
          {cartItems.length === 0 ? (
            <p>Кошик порожній</p>
          ) : (
            <>
              <div className="grid-container">
                {cartItems.map((item, index) => (
                  <article key={index} className="item">
                    <img src={item.img} alt={item.name} />
                    <div className="item-content">
                      <h3>{item.name}</h3>
                      <p>
                        Кількість:{" "}
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            updateQuantity(index, parseInt(e.target.value))
                          }
                        />
                      </p>
                      <p className="price">{item.price} грн</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                    >
                      Видалити
                    </button>
                  </article>
                ))}
              </div>
              <div className="cart-summary">
                <p>
                  Загальна сума: <span id="total">{total} грн</span>
                </p>
              </div>
              {user ? (
                <>
                  {error && <p className="error">{error}</p>}
                  {success && <p className="success">{success}</p>}
                  <form id="order-form" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      id="name"
                      placeholder="Ваше ім’я"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      id="phone"
                      placeholder="Телефон"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={cartItems.length === 0}>
                      Оформити замовлення
                    </button>
                  </form>
                </>
              ) : (
                <div className="auth-message">
                  <p>
                    Будь ласка, <Link to="/login">увійдіть</Link>, щоб оформити
                    замовлення.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default Cart;