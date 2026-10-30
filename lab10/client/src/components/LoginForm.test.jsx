import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm.jsx";

describe("LoginForm", () => {
  test("отправляет введённые e-mail и пароль", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ user: { id: 1 }, token: "token" })));
    render(<LoginForm onLogin={onLogin} />);

    await user.type(screen.getByLabelText(/e-?mail|почта/i), "farmer@agromarket.kz");
    await user.type(screen.getByLabelText(/пароль/i), "secret123");
    await user.click(screen.getByRole("button", { name: /войти/i }));

    expect(onLogin).toHaveBeenCalledWith({ id: 1 }, "token");
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/auth/login"), expect.objectContaining({ method: "POST" }));
  });

  test("с пустыми полями не отправляет и показывает ошибку", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);

    await user.click(screen.getByRole("button", { name: /войти/i }));

    expect(onLogin).not.toHaveBeenCalled();
  });

  test("не принимает некорректный адрес электронной почты", async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={vi.fn()} />);
    const email = screen.getByLabelText(/e-?mail|почта/i);
    await user.type(email, "непочта");
    expect(email).toBeInvalid();
  });

  test("переключается в режим регистрации и показывает поле имени", async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /нет аккаунта/i }));
    expect(screen.getByPlaceholderText("Имя")).toBeRequired();
    expect(screen.getByRole("button", { name: /зарегистрироваться/i })).toBeInTheDocument();
  });

  test("показывает ошибку API и не выполняет вход при отказе сервера", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Неверный пароль" }), { status: 401 }),
    );
    render(<LoginForm onLogin={onLogin} />);
    await user.type(screen.getByLabelText("Email"), "buyer@example.com");
    await user.type(screen.getByLabelText("Пароль"), "password123");
    await user.click(screen.getByRole("button", { name: "Войти" }));
    expect(await screen.findByText("Неверный пароль")).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
