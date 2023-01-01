import express from "express";
import session from "express-session";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";

// import { responses } from "./utils/responses";
import { indexRouter } from "./router";
import { uploadCloudinary } from "./utils/cloudinaryFileUpload";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(morgan("combined")); //http request logger
// app.use(session());
app.use(fileUpload());
app.use(express.json());

app.post("/test/upload", uploadCloudinary);
app.use(indexRouter);
