import express from "express";
import {
  detectFaceAI,
  viewUserHistory,
  deleteHistory,
} from "./image.controller";

//middlewares
import {
  verifyBody_detectFace,
  verifyBody_ViewUserHistory,
  verifyQuery_DeleteHistory,
} from "../../../middlewares/image.middleware";

export const imageRouter = express.Router();

imageRouter.post("/detectface", verifyBody_detectFace, detectFaceAI);

imageRouter.post("/history", verifyBody_ViewUserHistory, viewUserHistory);

imageRouter.delete("/history", verifyQuery_DeleteHistory, deleteHistory);
