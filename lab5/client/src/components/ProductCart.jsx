function ProductCard({ product, addOn }) {
  return (
    <article className="card">
      {/* ЗАДАНИЕ: выведите картинку товара через <img> */}
      {/* используйте product.image и product.name (для alt) */}
      <img src={product.images} alt="" />
      <h3>{product.name}</h3>
      <p>{product.price} тг</p>
      <button onClick={() => addOn((prev) => prev + 1)}>В корзину</button>
    </article>
  );
}

export default ProductCard;
