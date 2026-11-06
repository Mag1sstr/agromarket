export default function ProductCard({ product, onAdd }) {
  const isOutOfStock = product.stock === 0;

  return (
    <article className="card" data-testid="product-card">
      {product.image && <img src={product.image} alt={product.name} />}
      <h3>{product.name}</h3>
      <p>{product.price} тг</p>
      <span>{product.category}</span>

      {isOutOfStock && <p>Нет в наличии</p>}

      <button onClick={() => onAdd?.(product)} disabled={isOutOfStock}>
        В заявку
      </button>
    </article>
  );
}
