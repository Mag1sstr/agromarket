function ProductCard({ product }) {
  return (
    <article className="card">
      {/* ЗАДАНИЕ: выведите картинку товара через <img> */}
      {/* используйте product.image и product.name (для alt) */}
      <img src={product.images} alt="" />
      <h3>{product.name}</h3>
      <p>{product.price} тг</p>
      <button>В корзину</button>
    </article>
  );
}

export default ProductCard;
