import { useState } from "react";

function ContactForm() {
  const [value, setValue] = useState({
    name: "",
    email: "",
    quantity: "",
  });
  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: value.name,
        email: value.email,
        quantity: value.quantity,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
    alert("Заявка отправлена! Мы свяжемся с вами.");
    e.target.reset();
  }

  console.log(value);

  return (
    <section id="contact" className="contact">
      <h2>Оптовая заявка</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Имя / организация</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={value.name}
          onChange={(e) => setValue({ ...value, name: e.target.value })}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="farmer@mail.kz"
          alue={value.email}
          onChange={(e) => setValue({ ...value, email: e.target.value })}
        />

        <input type="tel" placeholder="+7 7XX XXX XX XX" />
        <input
          type="number"
          value={value.quantity}
          onChange={(e) => setValue({ ...value, quantity: e.target.value })}
          placeholder="Объем заказа"
          min={10}
          required
        />
        <input type="date" />

        <label htmlFor="comment">Комментарий</label>
        <textarea id="comment" name="comment" rows="4" />

        <button type="button" onClick={handleSubmit}>
          Отправить заявку
        </button>
      </form>
    </section>
  );
}

export default ContactForm;
