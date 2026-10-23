import request from "supertest";
import app from "../app.js";

describe("GET /api/health", () => {
  it("returns service and database status", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok", db: "connected" });
    expect(Number.isNaN(Date.parse(response.body.time))).toBe(false);
  });
});
