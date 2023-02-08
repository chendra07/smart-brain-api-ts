import express from "express";
import { httpOneUser, httpUpdateUser } from "./users.controller";
import { verifyBody_UpdateUser } from "../../../middlewares/users.middleware";

export const usersRouter = express.Router();

usersRouter.get("/oneuser", httpOneUser);

usersRouter.put("/updateuser", verifyBody_UpdateUser, httpUpdateUser);
