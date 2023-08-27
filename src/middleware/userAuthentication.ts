import { Request, Response, NextFunction } from "express";
import { SECRET } from "../config";
import jwt, { TokenExpiredError } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["accessToken"];
  if (!accessToken) {
    return res.status(401).json({ message: "user not logged in" });
  }
  try {
    const secret = SECRET as string;
    const payload = jwt.verify(accessToken, secret) as { email: string };
    (req as AuthenticatedRequest).user = { email: payload.email };

    if (payload) {
      return next();
    }
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired" });
    } else {
      next(error);
    }
  }
};
