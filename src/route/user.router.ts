import { isAuthenticated } from "../middleware/userAuthentication";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { Router } from "express";
import {
  create_folder,
  downloadFile,
  upload_file,
} from "../controllers/userFile";

const userRouter = Router();

userRouter.get("/get", isAuthenticated, getUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/upload", isAuthenticated, upload_file);
userRouter.get(
  "/download/:folderName/:public_id",
  isAuthenticated,
  downloadFile
);
userRouter.post("/create-folder", create_folder);

export default userRouter;
