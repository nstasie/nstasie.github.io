import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Помилка реєстрації");
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
        <h2>Реєстрація</h2>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Зареєструватися</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="auth-link">
          Вже маєте акаунт? <a href="/login">Увійти</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;