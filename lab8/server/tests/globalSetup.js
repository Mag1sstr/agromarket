import pg from "pg";
import dotenv from "dotenv";
import { resolve } from "node:path";

export async function setup() {
  dotenv.config({ path: resolve(process.cwd(), ".env.test"), override: true });
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL обязателен для тестов");

  const databaseName = new URL(databaseUrl).pathname.replace(/^\//, "");
  if (databaseName !== "agromarket_test") {
    throw new Error(
      `Тесты остановлены: разрешена только база agromarket_test, получено ${databaseName}`,
    );
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    await client.query("SELECT 1");
    const { rows } = await client.query("SELECT to_regclass('public.users') AS users");
    if (!rows[0].users) {
      throw new Error("Таблиц нет. Инициализируйте agromarket_test по инструкции.");
    }
  } finally {
    await client.end();
  }
}
