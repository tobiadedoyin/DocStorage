import { Pool } from "pg";
import dotenv from "dotenv";
import { DATABASE_URL } from "../config/index";

dotenv.config();

// ==> Conexão com a Base de Dados:
const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on("connect", () => {
  console.log("database has been successfully connected");
});

export default {
  query: (text: string, params: Array<string>) => pool.query(text, params),
};
