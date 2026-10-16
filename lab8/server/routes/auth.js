import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Выпускает токен: внутри id и роль, подпись — нашим секретным ключом
function createToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" },
  );
}

// POST /api/auth/register   { name, email, password }
router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Поля name, email и password обязательны" });
  }
  if (String(password).length < 8) {
    return res
      .status(400)
      .json({ error: "Пароль должен быть не короче 8 символов" });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  // role не передаём — база поставит DEFAULT 'user'
  let rows;
  try {
    ({ rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [String(name).trim(), String(email).trim().toLowerCase(), passwordHash],
    ));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email уже зарегистрирован" });
    }
    return next(error);
  }
  const user = rows[0];

  // Сразу после регистрации пользователь считается вошедшим
  res.status(201).json({ user, token: createToken(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Поля email и password обязательны" });
  }

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    String(email).trim().toLowerCase(),
  ]);
  const user = rows[0];

  // Пользователь найден И пароль совпал с хэшем
  const ok =
    user && (await bcrypt.compare(String(password), user.password_hash));
  if (!ok) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  // Убираем хэш из объекта перед отправкой клиенту
  const { password_hash, ...safeUser } = user;
  res.json({ user: safeUser, token: createToken(safeUser) });
});

router.get("/users", async (req, res) => {
  const users = await pool.query("SELECT id, name, email FROM users");

  res.json(users.rows);
});

// GET /api/auth/me — нужен токен
router.get("/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [req.user.id],
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  res.json(rows[0]);
});

export default router;
