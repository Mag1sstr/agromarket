import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { getAdminToken, getUserToken } from "./helpers.js";

describe("Product write access", () => {
  const product = { name: "Test crop", category: "test", price: 125, unit: "kg" };

  it("rejects missing, customer, and forged tokens", async () => {
    expect((await request(app).post("/api/products").send(product)).status).toBe(401);
    const userToken = await getUserToken();
    expect((await request(app).post("/api/products").set("Authorization", `Bearer ${userToken}`).send(product)).status).toBe(403);
    const forged = jwt.sign({ sub: "1", role: "admin" }, "wrong-secret");
    expect((await request(app).post("/api/products").set("Authorization", `Bearer ${forged}`).send(product)).status).toBe(401);
  });

  it("allows an administrator to create, read, update, and delete a product", async () => {
    const token = await getAdminToken();
    const created = await request(app).post("/api/products").set("Authorization", `Bearer ${token}`).send(product);
    expect(created.status).toBe(201);
    const id = created.body.id;
    expect((await request(app).get(`/api/products/${id}`)).status).toBe(200);
    const updated = await request(app).put(`/api/products/${id}`).set("Authorization", `Bearer ${token}`).send({ ...product, name: "Updated crop", price: 150 });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe("Updated crop");
    expect((await request(app).delete(`/api/products/${id}`).set("Authorization", `Bearer ${token}`)).status).toBe(204);
  });
});
