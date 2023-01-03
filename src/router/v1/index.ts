import express from "express";

//middleware
import { verifyToken } from "../../middlewares/auth.middleware";

import { usersRouter } from "../v1/users/users.router";
import { authRouter } from "./auth/auth.router";

export const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", usersRouter);
