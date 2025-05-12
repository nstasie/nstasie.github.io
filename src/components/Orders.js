import React from "react";
import { Link } from "react-router-dom";

function Orders({ orders, expandedOrder, setExpandedOrder, user, error }) {
  const toggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

const userOrders = orders;

  return (
    <section id="orders">
      <h2>Мої замовлення</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : user ? (
        userOrders.length > 0 ? (
          <div className="grid-container">
            {userOrders.map((order) => (
              <article key={order.orderId} className="item">
                <h3
                  className="order-title"
                  onClick={() => toggleDetails(order.orderId)}
                >
                  Замовлення {order.orderId}
                </h3>
                <div
                  className="order-details"
                  style={{
                    display: expandedOrder === order.orderId ? "block" : "none",
                  }}
                >
                  <p>Дата: {order.date}</p>
                  <p>Сума: {order.total} грн</p>
                  <p className="delivery-timer">
                    {order.timeLeft > 0
                      ? `Очікуваний час доставки: ${Math.floor(
                          order.timeLeft / 60
                        )}:${order.timeLeft % 60 < 10 ? "0" : ""}${
                          order.timeLeft % 60
                        }`
                      : "Замовлення доставлено"}
                  </p>
                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h4>Товари:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={item.img} alt={item.name} />
                          <div>
                            <p>{item.name}</p>
                            <p>Кількість: {item.quantity}</p>
                            <p>Ціна: {item.price} грн</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>У вас немає замовлень.</p>
        )
      ) : (
        <div className="orders-auth-message">
          <p>
            Будь ласка, <Link to="/login">увійдіть</Link>, щоб переглянути
            замовлення.
          </p>
        </div>
      )}
    </section>
  );
}

export default Orders;