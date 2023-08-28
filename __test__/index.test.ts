import request from "supertest";
import app from "../src/app";
import user from "../src/db/dbconfig";
import bcrypt from "bcrypt";

// Mock the user module methods
jest.mock("../db/dbconfig", () => ({
  query: jest.fn(),
}));

describe("Authentication Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    // Mock user.query method for registration
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [], // Simulate no existing user with the same email
    });

    // Make a request to your registration endpoint using Supertest
    const response = await request(app).post("/register").send({
      full_name: "Test User",
      email: "test@example.com",
      password: "password",
    });

    // Assert the response status and body
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("user registered successfully");
    expect(user.query).toHaveBeenCalledTimes(2); // Once for SELECT, once for INSERT
  });

  it("should not register a user with existing email", async () => {
    // Mock user.query method to simulate existing user
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ email: "test@example.com" }],
    });

    // Make a request to your registration endpoint using Supertest
    const response = await request(app).post("/register").send({
      full_name: "Test User",
      email: "test@example.com",
      password: "password",
    });

    // Assert the response status and body
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("user already exist");
    expect(user.query).toHaveBeenCalledTimes(1); // Only for SELECT
  });

  it("should log in a user", async () => {
    // Mock user.query method to simulate an existing user with hashed password
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ email: "test@example.com", password: "hashedPassword" }],
    });

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "password",
    });

    // Assert the response status and body
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("welcome");
    expect(response.header["set-cookie"][0]).toContain("accessToken");
    expect(user.query).toHaveBeenCalledTimes(1); // Only for SELECT
  });

  it("should not log in with incorrect password", async () => {
    // Mock user.query method to simulate an existing user with hashed password
    (user.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ email: "test@example.com", password: "hashedPassword" }],
    });

    // Make a request to your login endpoint using Supertest
    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "incorrectPassword",
    });

    // Assert the response status and body
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("incorrect password");
    expect(user.query).toHaveBeenCalledTimes(1); // Only for SELECT
  });
});
