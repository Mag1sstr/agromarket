import request from "supertest";
import app from "../app.js";
import { pool } from "../db/pool.js";

let counter = 0;
export const uniqueEmail = (prefix = "user") =>
  `${prefix}-${Date.now()}-${++counter}@example.test`;

export async function getUserToken() {
  const email = uniqueEmail("customer");
  const response = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test Customer", email, password: "Password123!" });
  if (response.status !== 201) throw new Error(`Не удалось создать пользователя: ${response.status}`);
  return response.body.token;
}

export async function getAdminToken() {
  const email = uniqueEmail("admin");
  const response = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test Admin", email, password: "Password123!" });
  if (response.status !== 201) throw new Error(`Не удалось создать администратора: ${response.status}`);
  await pool.query("UPDATE users SET role = 'admin' WHERE id = $1", [response.body.user.id]);
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "Password123!" });
  return login.body.token;
}
