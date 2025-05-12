import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Помилка входу");
      }

      const { token } = await response.json();
      localStorage.setItem('token', token); // Зберігаємо JWT-токен
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Вхід</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Електронна пошта</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введіть email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введіть пароль"
            />
          </div>
          <button type="submit">Увійти</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="auth-link">
          Немає акаунту? <a href="/signup">Зареєструватися</a>
        </p>
      </div>
    </div>
  );
};

export default Login;