import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import Menu from "./pages/Menu";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Footer from "./components/Footer";
import "./styles.css";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setOrders([]);
            return;
          }

          const response = await fetch('http://localhost:5000/api/orders', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Помилка при завантаженні замовлень");
          }

          const loadedOrders = await response.json();
          setOrders(loadedOrders);
        } catch (error) {
          console.error("Помилка при завантаженні замовлень:", error);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (dish) => {
    const existingItem = cartItems.find((item) => item.name === dish.name);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.name === dish.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...dish, quantity: 1 }]);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} setUser={setUser} setOrders={setOrders} />
        <Routes>
          <Route path="/" element={<Menu addToCart={addToCart} />} />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                setCartItems={setCartItems}
                user={user}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrdersPage orders={orders} setOrders={setOrders} user={user} />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;