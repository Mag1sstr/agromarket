import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../test/server.js";
import AddProductForm from "./AddProductForm.jsx";
import LoginForm from "./LoginForm.jsx";

describe("ответы API в формах", () => {
  test("показывает сообщение сервера при ограничении частоты входа (429)", async () => {
    server.use(
      http.post("*/api/auth/login", () =>
        HttpResponse.json(
          { error: "Слишком много попыток. Попробуйте позже" },
          { status: 429 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<LoginForm onLogin={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), "buyer@example.com");
    await user.type(screen.getByLabelText(/пароль/i), "password123");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText(/слишком много попыток/i)).toBeInTheDocument();
  });

  test("показывает детали валидации при ошибке регистрации (400)", async () => {
    server.use(
      http.post("*/api/auth/register", () =>
        HttpResponse.json(
          { details: [{ field: "email", message: "Некорректный e-mail" }] },
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<LoginForm onLogin={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /нет аккаунта/i }));
    await user.type(screen.getByLabelText("Имя"), "Покупатель");
    await user.type(screen.getByLabelText("Email"), "buyer@example.com");
    await user.type(screen.getByLabelText("Пароль"), "password123");
    await user.click(screen.getByRole("button", { name: "Зарегистрироваться" }));

    expect(await screen.findByText("Некорректный e-mail")).toBeInTheDocument();
  });

  test("показывает ошибку валидации цены при создании товара (400)", async () => {
    server.use(
      http.post("*/api/products", () =>
        HttpResponse.json(
          { details: [{ field: "price", message: "Цена должна быть больше 0" }] },
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<AddProductForm />);

    await user.type(screen.getByLabelText(/название/i), "Мёд");
    const price = screen.getByLabelText(/цена/i);
    await user.fill(price, "-500");
    // Браузерное ограничение min блокирует отрицательное значение, поэтому
    // имитируем обход клиентской проверки и проверяем ответ серверной валидации.
    price.setCustomValidity("");
    fireEvent.submit(screen.getByRole("button", { name: /создать товар/i }).closest("form"));

    expect(await screen.findByText("Цена должна быть больше 0")).toBeInTheDocument();
  });

  test("пока товар сохраняется, кнопка отправки заблокирована", async () => {
    let finishRequest;
    server.use(
      http.post("*/api/products", async () => {
        await new Promise((resolve) => { finishRequest = resolve; });
        return HttpResponse.json({ id: 3, name: "Мёд", price: 100, category: null });
      }),
    );
    const user = userEvent.setup();
    render(<AddProductForm />);

    await user.type(screen.getByLabelText(/название/i), "Мёд");
    await user.type(screen.getByLabelText(/цена/i), "100");
    await user.click(screen.getByRole("button", { name: /создать товар/i }));

    expect(screen.getByRole("button", { name: /сохранение/i })).toBeDisabled();
    finishRequest();
    await waitFor(() => expect(screen.getByText(/товар успешно создан/i)).toBeInTheDocument());
  });
});
