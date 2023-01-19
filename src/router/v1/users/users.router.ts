import express from "express";
import { httpOneUser, httpUpdateUser } from "./users.controller";
import {
  verifyQuery_OneUser,
  verifyBody_UpdateUser,
} from "../../../middlewares/users.middleware";

export const usersRouter = express.Router();

usersRouter.get("/oneuser", verifyQuery_OneUser, httpOneUser);

usersRouter.put("/updateuser", verifyBody_UpdateUser, httpUpdateUser);
