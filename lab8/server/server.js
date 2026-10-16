import "dotenv/config";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET не задан. Добавьте его в server/.env.");
}

const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API запущен: http://localhost:${PORT}`);
});
