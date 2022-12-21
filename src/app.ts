import express from "express";
import cors from "cors";
import morgan from "morgan";

import { responses } from "./utils/responses";
import { indexRouter } from "./router";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(morgan("combined")); //http request logger
app.use(express.json());
// app.get("/", (req, res) => {
//   responses.res200(req, res, {
//     test: "Hello World",
//   });
// });
app.use(indexRouter);
