import express from "express";
import { httpPostOneUser } from "./users.controller";
import { verifyBody_PostOneUser } from "../../../middlewares/users.middleware";

export const usersRouter = express.Router();

usersRouter.post("/one-user", verifyBody_PostOneUser, httpPostOneUser);
