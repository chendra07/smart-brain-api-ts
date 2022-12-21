import express from "express";
import { httpGetAllUsers } from "./users.controller";

export const usersRouter = express.Router();

usersRouter.get("/all", httpGetAllUsers);
