import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCart from "./ProductCart.jsx";

const product = {
  id: 1,
  name: "Мёд гречишный",
  price: 3500,
  category: "Мёд",
  farmer: "КХ «Береке»",
  stock: 5,
};

describe("ProductCart", () => {
  test("показывает название, цену и категорию", () => {
    render(<ProductCart product={product} />);
    expect(screen.getByText("Мёд гречишный")).toBeInTheDocument();
    expect(screen.getByText(/3\s?500/)).toBeInTheDocument(); // 3500 или «3 500 ₸»
    expect(screen.getByText("Мёд")).toBeInTheDocument();
  });

  test("кнопка «В заявку» вызывает onAdd с товаром", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(); // «шпион»: запоминает, как его вызвали
    render(<ProductCart product={product} onAdd={onAdd} />);

    await user.click(
      screen.getByRole("button", { name: /в заявку|добавить/i }),
    );

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(product);
  });

  test("при отсутствии товара кнопка disabled и показывается сообщение", () => {
    render(<ProductCart product={{ ...product, stock: 0 }} />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText(/нет в наличии/i)).toBeInTheDocument();
  });
});
