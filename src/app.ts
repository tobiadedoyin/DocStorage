import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./route/user.router";

const app = express();

//middleware
app.use(morgan(":date => :url => :method ==> :response-time ms"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", userRouter);

export default app;
