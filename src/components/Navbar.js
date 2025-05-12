import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ user, setUser, setOrders }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setOrders([]);
      navigate("/");
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <nav>
        <div className="nav-left">
          <img src="images/logo.png" alt="Logo" className="logo" />
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Меню</Link>
          </li>
          <li>
            <Link to="/cart">Кошик</Link>
          </li>
          <li>
            <Link to="/orders">Замовлення</Link>
          </li>
        </ul>
        <div className="nav-right">
          <div className="user-menu-container" ref={menuRef}>
            <button className="profile-btn" onClick={toggleMenu}>
            🙋🏻‍♀️
            </button>
            {isMenuOpen && (
              <div className="user-menu">
                {user ? (
                  <>
                    <span className="user-email">{user.email}</span>
                    <button className="user-menu-link" onClick={handleSignOut}>
                      Вийти
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="user-menu-link">
                      Вхід
                    </Link>
                    <Link to="/signup" className="user-menu-link">
                      Реєстрація
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;