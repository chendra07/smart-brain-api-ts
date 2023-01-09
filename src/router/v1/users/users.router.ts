import express from "express";
import { httpOneUser, httpUpdateUser, httpDummyReq } from "./users.controller";
import {
  verifyBody_OneUser,
  verifyBody_UpdateUser,
} from "../../../middlewares/users.middleware";

export const usersRouter = express.Router();

usersRouter.post("/oneuser", verifyBody_OneUser, httpOneUser);

usersRouter.put("/updateuser", verifyBody_UpdateUser, httpUpdateUser);

// usersRouter.post("/dummy", httpDummyReq);
