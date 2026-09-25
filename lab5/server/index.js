const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// data
const data = {
  products: [
    { id: 1, name: "Laptop", price: 1200, category: "electronics" },
    { id: 2, name: "Phone", price: 800, category: "electronics" },
    { id: 3, name: "Coffee Mug", price: 25, category: "home" },
    { id: 4, name: "Backpack", price: 60, category: "travel" },
  ],
  orders: [
    { id: 1, customer: "Alice", items: [1, 2], total: 2000, status: "created" },
    { id: 2, customer: "Bob", items: [3], total: 25, status: "created" },
  ],
};

// middleware
const middleware = {
  logger(req, res, next) {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.originalUrl}`);
    next();
  },
};
app.use(cors());
app.use(express.json());
app.use(middleware.logger);

const routes = {
  home(req, res) {
    res.json({
      message: "Welcome to the API",
      endpoints: [
        "/",
        "/api/health",
        "/products",
        "/products/:id",
        "/orders",
        "/orders/:id",
      ],
    });
  },

  health(req, res) {
    res.json({
      ok: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  },

  getProducts(req, res) {
    res.json({
      success: true,
      data: data.products,
      count: data.products.length,
    });
  },

  getProductById(req, res) {
    const { id } = req.params;
    const product = data.products.find(
      (item) => String(item.id) === String(id),
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  },

  getOrders(req, res) {
    res.json({
      success: true,
      data: data.orders,
      count: data.orders.length,
    });
  },

  createOrder(req, res) {
    const { customer, items = [], total = 0 } = req.body || {};

    if (!customer || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order requires customer and at least one item",
      });
    }

    const newOrder = {
      id: data.orders.length ? data.orders[data.orders.length - 1].id + 1 : 1,
      customer,
      items,
      total,
      status: "created",
    };

    data.orders.push(newOrder);

    return res.status(201).json({
      success: true,
      message: "Order created",
      data: newOrder,
    });
  },

  getOrderById(req, res) {
    const { id } = req.params;
    const order = data.orders.find((item) => String(item.id) === String(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with id ${id} not found`,
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  },
};

app.get("/", routes.home);
app.get("/api/health", routes.health);
app.get("/products", routes.getProducts);
app.get("/products/:id", routes.getProductById);
app.get("/orders", routes.getOrders);
app.get("/orders/:id", routes.getOrderById);
app.post("/orders", routes.createOrder);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedUrl: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
