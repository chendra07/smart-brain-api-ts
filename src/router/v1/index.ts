import express from "express";

//middleware
import { verifySession } from "../../middlewares/auth.middleware";

import { usersRouter } from "./users/users.router";
import { authRouter } from "./auth/auth.router";
import { imageRouter } from "./image/image.router";

export const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", verifySession, usersRouter);
v1Router.use("/image", verifySession, imageRouter);
