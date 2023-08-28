import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import userRouter from "./route/user.router";
import cors from "cors";
import redis, { RedisClientOptions } from "redis";
import { REDIS_HOST, REDIS_PORT } from "config";
import fileupload from "express-fileupload";

const app = express();

async () => {
  const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
  } as RedisClientOptions);
  redisClient.on("error", (error) => console.error(error));
  redisClient.on("connect", () => {
    console.log("connected to Redis");
  });

  redisClient.on("ready", async () => {
    console.log("Redis client is ready");
  });

  redisClient.on("end", () => {
    console.log("Redis connection closed");
  });
};

//middleware
app.use(morgan(":date => :url => :method ==> :response-time ms"));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(
  fileupload({ useTempFiles: true, limits: { fileSize: 200 * 1024 * 1024 } })
);

app.use("/api/v1", userRouter);

export default app;
