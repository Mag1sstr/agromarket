import request from "supertest";
import app from "../app.js";

describe("Products API", () => {
  it("returns a public product catalog with expected fields", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length) {
      expect(response.body[0]).toEqual(expect.objectContaining({
        id: expect.any(Number), name: expect.any(String), price: expect.any(Number),
      }));
    }
  });

  it("returns 404 for a missing product", async () => {
    const response = await request(app).get("/api/products/2147483647");
    expect(response.status).toBe(404);
  });
});
