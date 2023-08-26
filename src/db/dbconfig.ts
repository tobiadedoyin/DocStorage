import { Pool } from "pg";

const pool = new Pool();

module.exports = {
  query: (text: string, params: any) => pool.query(text, params),
};
