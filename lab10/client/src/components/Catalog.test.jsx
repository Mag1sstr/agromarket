import { render, screen, waitFor } from "@testing-library/react";
import App from "../App.jsx";

const products = [
  { id: 1, name: "Мёд гречишный", price: 3500, category: "Мёд", stock: 4 },
  { id: 2, name: "Пшеница 3 класса", price: 120, category: "Зерно", stock: 8 },
];

function mockProductsResponse(body, status = 200) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("Каталог с мокированным API", () => {
  test("показывает загрузку, затем товары из API", async () => {
    let resolveFetch;
    vi.spyOn(globalThis, "fetch").mockReturnValue(
      new Promise((resolve) => { resolveFetch = resolve; }),
    );

    render(<App />);
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
    resolveFetch(new Response(JSON.stringify(products)));

    expect(await screen.findByText("Мёд гречишный")).toBeInTheDocument();
    expect(screen.getByText("Пшеница 3 класса")).toBeInTheDocument();
    expect(screen.queryByText(/загрузка/i)).not.toBeInTheDocument();
  });

  test("запрашивает каталог по адресу API", async () => {
    const fetchSpy = mockProductsResponse(products);
    render(<App />);
    await screen.findByText("Мёд гречишный");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(String(fetchSpy.mock.calls[0][0])).toMatch(/\/api\/products/);
  });

  test("показывает ошибку при ответе сервера с ошибкой", async () => {
    mockProductsResponse({ error: "Ошибка" }, 500);
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/ошибка/i);
  });

  test("показывает ошибку при недоступной сети", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to fetch/i);
  });

  test("показывает пустой каталог, если API вернул пустой список", async () => {
    mockProductsResponse([]);
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText(/загрузка/i)).not.toBeInTheDocument());
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
