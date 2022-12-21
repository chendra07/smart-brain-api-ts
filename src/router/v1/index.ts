import express from "express";

import { usersRouter } from "../v1/users/users.router";

export const v1Router = express.Router();

v1Router.use("/users", usersRouter);
