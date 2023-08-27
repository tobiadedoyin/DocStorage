import { isAuthenticated } from "../middleware/userAuthentication";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/get", getUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
