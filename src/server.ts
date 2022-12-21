import dotenv from "dotenv";
import { app } from "./app";

import { openConnection } from "./services/postgresDB";

dotenv.config();
const PORT = process.env.PORT || 8000;

async function startServer() {
  //run any async actions here (connect db, load csv files, etc.)
  await openConnection();

  app.listen(PORT, () => {
    console.log("listening on port: ", PORT);
  });
}

startServer();
