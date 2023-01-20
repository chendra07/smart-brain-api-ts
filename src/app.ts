import express from "express";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import Keygrip from "keygrip";

import { indexRouter } from "./router";

export const app = express();
app.use(helmet()); //securing HTTP headers

const { ACCEPTED_URL, COOKIE_SESSION_KEY } = process.env;

dotenv.config();

// const whitelist = ACCEPTED_URL!.split(", ");
app.use(cors());
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

const sessionKeys = COOKIE_SESSION_KEY!.split(", ");
const keys = new Keygrip(sessionKeys, "sha256", "hex");
app.use(
  cookieSession({
    name: "session",
    maxAge: 15 * 60 * 1000,
    keys: keys,
  })
);

app.use(morgan("combined")); //http request logger
app.use(fileUpload());
app.use(express.json());

app.use(indexRouter);
