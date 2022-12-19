import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();
const PORT = process.env.PORT || 8000;

async function startServer() {
  //run any async actions here (connect db, load csv files, etc.)

  app.listen(PORT, () => {
    console.log("listening on port: ", PORT);
  });
}

startServer();
