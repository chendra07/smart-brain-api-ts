import express from "express";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { indexRouter } from "./router";

export const app = express();

const { ACCEPTED_URL, EXP_SESSION_SECRET } = process.env;

const whitelist = ACCEPTED_URL!.split(", ");

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (whitelist.indexOf(origin!) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
dotenv.config();
app.use(cors());

app.use(morgan("combined")); //http request logger
app.use(helmet()); //securing HTTP headers
app.use(fileUpload());
app.use(express.json());

app.use(indexRouter);
