import React, { useState } from "react";

function DishCard({ dish, addToCart }) {
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: "rgb(120, 188, 8)",
  });

  const handleAddToCart = () => {
    setButtonStyle({ backgroundColor: "#ccc" });
    setTimeout(
      () => setButtonStyle({ backgroundColor: "rgb(120, 188, 8)" }),
      1000
    );
    addToCart(dish);
  };

  return (
    <article className="item">
      <img src={dish.img} alt={dish.name} />
      <h3>
        {dish.name}{" "}
        {dish.isNew && <span style={{ color: "red" }}>(Новинка)</span>}
      </h3>
      <p>{dish.desc}</p>
      <p className="price">{dish.price} грн</p>
      <button
        className="add-to-cart"
        style={buttonStyle}
        onClick={handleAddToCart}
      >
        Додати в кошик
      </button>
    </article>
  );
}

export default DishCard;