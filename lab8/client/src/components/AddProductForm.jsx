import React, { useState } from "react";

export default function AddProductForm({ token, onProductCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "кг",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Универсальный обработчик полей ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/products", {
        // Укажите ваш полный путь, если API на другом домене
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Так как эндпоинт защищен requireAuth, передаем JWT-токен (например, из localStorage)
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category || null,
          price: Number(formData.price),
          unit: formData.unit || "кг",
          image: formData.image || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании товара");
      }

      setSuccess(true);
      setFormData({ name: "", category: "", price: "", unit: "кг", image: "" });

      // Если нужно передать созданный товар наверх (например, обновить список)
      if (onProductCreated) {
        onProductCreated(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Добавить новый товар</h3>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>Товар успешно создан!</div>}

      <div style={styles.field}>
        <label>Название *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div style={styles.field}>
        <label>Категория</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Например, Овощи"
        />
      </div>

      <div style={styles.field}>
        <label>Цена *</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div style={styles.field}>
        <label>Единица измерения</label>
        <input
          type="text"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          placeholder="кг, шт, л"
        />
      </div>

      <div style={styles.field}>
        <label>Ссылка на картинку (URL)</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Сохранение..." : "Создать товар"}
      </button>
    </form>
  );
}

// Простые стили для наглядности
const styles = {
  form: {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  field: {
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
  success: {
    color: "green",
    marginBottom: "10px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#FFD200",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
