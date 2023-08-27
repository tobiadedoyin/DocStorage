import app from "./app";
import { PORT } from "./config/index";
import http from "http";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server listeninig on port ${PORT}`);
});
