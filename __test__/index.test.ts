import request from "supertest";
import app from "../src/app";
import user from "../src/db/dbconfig";
import bcrypt from "bcrypt";

jest.mock("../db/dbconfig", () => ({
  query: jest.fn(),
}));

describe("Authentication Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [],
    });

    const response = await request(app).post("/register").send({
      full_name: "Test User",
      email: "test@example.com",
      password: "password",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("user registered successfully");
    expect(user.query).toHaveBeenCalledTimes(2);
  });

  it("should not register a user with existing email", async () => {
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ email: "test@example.com" }],
    });

    const response = await request(app).post("/register").send({
      full_name: "Test User",
      email: "test@example.com",
      password: "password",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("user already exist");
    expect(user.query).toHaveBeenCalledTimes(1);
  });

  it("should log in a user", async () => {
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ email: "test@example.com", password: "hashedPassword" }],
    });

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("welcome");
    expect(response.header["set-cookie"][0]).toContain("accessToken");
    expect(user.query).toHaveBeenCalledTimes(1);
  });

  it("should not log in with incorrect password", async () => {
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ email: "test@example.com", password: "hashedPassword" }],
    });

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "incorrectPassword",
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("incorrect password");
    expect(user.query).toHaveBeenCalledTimes(1);
  });
});
