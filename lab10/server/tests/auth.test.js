import request from "supertest";
import app from "../app.js";
import { uniqueEmail } from "./helpers.js";

describe("Authentication API", () => {
  it("registers a user without allowing admin role assignment", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "New User", email: uniqueEmail(), password: "Password123!", role: "admin",
    });
    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe("user");
    expect(response.body.user.password_hash).toBeUndefined();
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("returns 409 for a duplicate email", async () => {
    const user = { name: "Duplicate", email: uniqueEmail(), password: "Password123!" };
    expect((await request(app).post("/api/auth/register").send(user)).status).toBe(201);
    expect((await request(app).post("/api/auth/register").send(user)).status).toBe(409);
  });

  it("logs in with valid credentials", async () => {
    const user = { name: "Login", email: uniqueEmail(), password: "Password123!" };
    await request(app).post("/api/auth/register").send(user);
    const response = await request(app).post("/api/auth/login").send({ email: user.email, password: user.password });
    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });
});
