import { useState } from "react";
import { apiFetch } from "../api";

export default function LoginForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' или 'register'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target));

    try {
      // /auth/login или /auth/register — оба возвращают { user, token }
      const res = await apiFetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      onLogin(result.user, result.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h3>{isLogin ? "Вход" : "Регистрация"}</h3>

      {!isLogin && <input name="name" placeholder="Имя" required />}
      <input name="email" type="email" placeholder="Email" required />
      <input
        name="password"
        type="password"
        placeholder="Пароль (от 8 символов)"
        required
        minLength={8}
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Подождите…" : isLogin ? "Войти" : "Зарегистрироваться"}
      </button>
      <button
        type="button"
        onClick={() => setMode(isLogin ? "register" : "login")}
      >
        {isLogin ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Войти"}
      </button>
    </form>
  );
}
