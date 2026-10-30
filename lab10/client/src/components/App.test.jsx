import { render, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import App from "../App.jsx";

describe("App component - JWT auth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test("отправляет запрос с Bearer токеном при наличии токена в localStorage", async () => {
    // 1. Покладываем токен в localStorage
    localStorage.setItem("token", "test-token");

    // 2. Мокаем глобальный fetch, чтобы перехватить запросы
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockImplementation(async (url) => {
        if (url.includes("/api/auth/me")) {
          return {
            ok: true,
            json: async () => ({ id: 1, email: "test@agromarket.kz" }),
          };
        }
        if (url.includes("/api/products")) {
          return {
            ok: true,
            json: async () => [],
          };
        }
        return { ok: true, json: async () => ({}) };
      });

    render(<App />);

    // Ждем, пока выполнится запрос /api/auth/me
    await waitFor(() => {
      const authCall = fetchSpy.mock.calls.find((call) =>
        call[0].includes("/api/auth/me"),
      );
      expect(authCall).toBeDefined();

      const [, options] = authCall;
      const authHeader =
        options.headers instanceof Headers
          ? options.headers.get("Authorization")
          : options.headers["Authorization"];

      // 3. Проверяем, что заголовок равен нашему токену
      expect(authHeader).toBe("Bearer test-token");
    });
  });
});
