import { describe, expect, it, vi, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import { requireAuth, requireRole } from "../middleware/auth.js";

function responseMock() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}

describe("auth middleware", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns 401 when authorization header is missing", () => {
    const res = responseMock();
    const next = vi.fn();
    requireAuth({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts a valid bearer token and attaches its user", () => {
    const req = { headers: { authorization: `Bearer ${jwt.sign({ sub: "42", role: "user" }, process.env.JWT_SECRET)}` } };
    const next = vi.fn();
    requireAuth(req, responseMock(), next);
    expect(req.user).toEqual({ id: 42, role: "user" });
    expect(next).toHaveBeenCalledOnce();
  });

  it("requires the requested role", () => {
    const res = responseMock();
    const next = vi.fn();
    requireRole("admin")({ user: { role: "user" } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
    requireRole("admin")({ user: { role: "admin" } }, responseMock(), next);
    expect(next).toHaveBeenCalledOnce();
  });
});
