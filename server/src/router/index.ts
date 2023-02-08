import express from "express";
import { v1Router } from "./v1";

export const indexRouter = express.Router();

indexRouter.use("/v1", v1Router);
