function ContactForm() {
  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: "Customer",
        items: [],
        total: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
    alert("Заявка отправлена! Мы свяжемся с вами.");
    e.target.reset();
  }

  return (
    <section id="contact" className="contact">
      <h2>Оптовая заявка</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Имя / организация</label>
        <input id="name" name="name" type="text" required />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="farmer@mail.kz"
        />

        <input type="tel" placeholder="+7 7XX XXX XX XX" />
        <input type="number" placeholder="Объем заказа" min={10} required />
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
