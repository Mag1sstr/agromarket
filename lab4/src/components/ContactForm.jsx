function ContactForm() {
  function handleSubmit(e) {
    e.preventDefault(); // не перезагружать страницу
    alert("Заявка отправлена! Мы свяжемся с вами.");
    e.target.reset(); // очистить поля
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

        {/* ЗАДАНИЕ: поле телефона — type="tel", placeholder "+7 7XX XXX XX XX" */}

        {/* ЗАДАНИЕ: объём заказа в кг — type="number", min="10", required */}

        {/* ЗАДАНИЕ: желаемая дата доставки — type="date" */}

        <label htmlFor="comment">Комментарий</label>
        <textarea id="comment" name="comment" rows="4" />

        <button type="submit">Отправить заявку</button>
      </form>
    </section>
  );
}

export default ContactForm;
