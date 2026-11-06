import { useState } from "react";
import { apiFetch } from "../api";

export default function AddProductForm({ onAdded }) {
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await apiFetch("/api/products", {
        method: "POST",
        body: JSON.stringify({ ...data, price: Number(data.price) }),
      });
      // ЗАДАНИЕ: отправьте POST /products через apiFetch.
      // ЗАДАНИЕ: тело — data, но price — числом:
      // ЗАДАНИЕ: { ...data, price: Number(data.price) }
      const product = await res.json();

      onAdded(product); // сообщаем App о новом товаре
      form.reset();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Новый товар</h3>
      <input name="name" placeholder="Название" required />
      <input name="category" placeholder="Категория" />
      <input
        name="price"
        type="number"
        min="0"
        placeholder="Цена, ₸"
        required
      />
      <input name="unit" placeholder="Единица (кг, л)" defaultValue="кг" />
      {error && <p className="error">{error}</p>}
      <button type="submit">Добавить</button>
    </form>
  );
}
