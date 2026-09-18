import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCart";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="catalog">
      <h2>Каталог</h2>
      <input
        type="text"
        placeholder="поиск"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <div>Загрузка</div>}
      {error && <div>Ошибка: {error}</div>}

      {products
        .filter((el) =>
          el.name
            .toLowerCase()
            .trim()
            .includes(searchTerm.toLowerCase().trim()),
        )
        .map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
    </div>
  );
}

export default App;
