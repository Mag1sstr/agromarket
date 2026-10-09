import LoginForm from "./LoginForm.jsx";

function Header({ cartCount = 0, user, onLogin, handleLogout }) {
  return (
    <header className="site-header">
      <a href="#" className="logo">
        🌾 АгроМаркет
      </a>

      <nav>
        <ul className="nav-links">
          <li>
            <a href="#catalog">Каталог</a>
          </li>
          <li>
            <a href="#delivery">Доставка</a>
          </li>
          <li>
            <a href="#contact">Контакты</a>
          </li>
        </ul>
      </nav>
      <div className="auth-bar">
        {user ? (
          <>
            <span>
              Вы вошли как <b>{user.name}</b> ({user.role})
            </span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <LoginForm onLogin={onLogin} />
        )}
      </div>

      <div className="cart">🛒 Корзина: {cartCount}</div>
    </header>
  );
}

export default Header;
