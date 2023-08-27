import { NextFunction, Request, Response } from "express";
import user from "../db/dbconfig";
import { inputvalidation } from "../utils/inputValidation";
import { handleResponse } from "../utils/handleResponse";
import { apiCodes } from "../utils/apiCodes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET } from "../config/index";
require("dotenv").config();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const full_name: string = req.body.full_name;
    const email: string = req.body.email;
    const password: string = req.body.password;

    const inputData = { full_name, email, password };
    const validation = inputvalidation.safeParse(inputData);

    if (!validation.success) {
      return handleResponse(
        res,
        apiCodes.unproccesable,
        `${validation.error.issues[0].message}`,
        []
      );
    }
    if (!full_name || !email || !password) {
      return handleResponse(
        res,
        apiCodes.unproccesable,
        "full_name, email and password is required",
        []
      );
    }

    const existingUser = await user.query(
      "SELECT email FROM users WHERE email=$1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return handleResponse(res, apiCodes.conflict, "user already exist", []);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) returning *",
      [
        full_name.toLowerCase().trim(),
        email.toLowerCase().trim(),
        hashedPassword,
      ]
    );
    return handleResponse(
      res,
      apiCodes.created,
      "user registered successfully",
      newUser.rows
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleResponse(
        res,
        apiCodes.UnAuthorized,
        "email and password is required",
        []
      );
    }

    const existingUser = await user.query(
      "SELECT email, password FROM users WHERE email =$1",
      [email]
    );
    if (existingUser.rows.length === 0) {
      return handleResponse(res, apiCodes.notFound, "user does not exist", []);
    }

    const storedPasswordHash = existingUser.rows[0].password;
    const comparePassword = await bcrypt.compare(password, storedPasswordHash);
    if (!comparePassword) {
      return handleResponse(res, apiCodes.forbidden, "incorrect password", []);
    }

    const secret = SECRET as string;
    const accessToken = jwt.sign({ email }, secret, {
      expiresIn: "24h",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 900000,
    });

    return handleResponse(res, apiCodes.successful, `welcome`, accessToken);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await user.query("SELECT * FROM users", []);
    return handleResponse(
      res,
      apiCodes.successful,
      "lists of users",
      result.rows
    );
  } catch (error) {
    next(error);
  }
};

//export default { get, registerUser };
