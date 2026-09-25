import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header cartCount={cartCount} />
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
            {products.data
              ?.filter((el) =>
                el.name
                  .toLowerCase()
                  .trim()
                  .includes(searchTerm.toLowerCase().trim()),
              )
              .map((product) => (
                <ProductCard
                  addOn={setCartCount}
                  key={product.id}
                  product={product}
                />
              ))}
          </div>
          {loading && <div>Загрузка</div>}
          {error && <div>Ошибка: {error}</div>}
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
      </main>

      <Footer />
    </>
  );
}

export default App;
