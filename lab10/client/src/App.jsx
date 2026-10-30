import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";
import { apiFetch } from "./api";
import AddProductForm from "./components/AddProductForm";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function handleLogin(user, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    (async () => {
      const res = await apiFetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    })();
  }, []);

  useEffect(() => {
    apiFetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить каталог");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message || "Не удалось загрузить каталог"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header
        cartCount={cartCount}
        user={user}
        onLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <main className="page">
        <section id="catalog" className="catalog">
          <div className="catalog-toolbar">
            <h2>Каталог</h2>
            <input
              type="text"
              placeholder="поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="product-grid">
            {products
              ?.filter((el) =>
                el.name
                  .toLowerCase()
                  .trim()
                  .includes(searchTerm.toLowerCase().trim()),
              )
              .map((product) => (
                <ProductCard
                  onAdd={() => setCartCount((count) => count + 1)}
                  key={product.id}
                  product={product}
                />
              ))}
          </div>
          {loading && <div>Загрузка</div>}
          {error && <div role="alert">Ошибка: {error}</div>}
        </section>
        <aside id="delivery" className="sidebar">
          <h3>Доставка</h3>
          <ul>
            <li>Астана — на следующий день</li>
            <li>Акмолинская область — 2–3 дня</li>
            <li>Бесплатно от 20 000 тг</li>
          </ul>
        </aside>
        <ContactForm />
        <AddProductForm />
      </main>

      <Footer />
    </>
  );
}

export default App;
