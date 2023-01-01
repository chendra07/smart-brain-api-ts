import express from "express";
import session from "express-session";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";

import { indexRouter } from "./router";
import { uploadCloudinary } from "./models/cloudinary.model";

export const app = express();

const { ACCEPTED_URL, EXP_SESSION_SECRET } = process.env;

app.use(
  cors({
    origin: ACCEPTED_URL!,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(morgan("combined")); //http request logger
app.use(helmet()); //securing HTTP headers
app.use(
  session({
    name: "smart-brain-db",
    secret: EXP_SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1 * 60 * 1000,
    },
  })
); //session
app.use(fileUpload());
app.use(express.json());

app.post("/test/upload", uploadCloudinary);
app.use(indexRouter);
