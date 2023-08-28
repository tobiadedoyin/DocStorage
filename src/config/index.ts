require("dotenv").config();

export const PORT = process.env.PORT || 5040;
export const DATABASE_URL = process.env.DATABASE_URL;
export const SECRET = process.env.SECRET;
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const REDIS_HOST = process.env.REDIS || "localhost";
export const REDIS_PORT = process.env.REDIS_PORT || 9909;
