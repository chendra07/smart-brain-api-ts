import express from "express";
import {
  httpPostRegister,
  httpPostLogin,
  httpRefreshToken,
  httpLogoutUser,
  httpDeleteUser,
} from "./auth.controller";
import {
  verifyBody_Register,
  verifyBody_Login,
  verifyBody_RefreshToken,
  verifyQuery_Logout,
  verifyQuery_DeleteUser,
  verifyToken,
} from "../../../middlewares/auth.middleware";
import { verifyFiles_UploadImage } from "../../../middlewares/image.middleware";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  verifyBody_Register,
  verifyFiles_UploadImage,
  httpPostRegister
);

authRouter.post("/login", verifyBody_Login, httpPostLogin);

authRouter.put("/refreshtoken", verifyBody_RefreshToken, httpRefreshToken);

authRouter.delete("/logout", verifyToken, verifyQuery_Logout, httpLogoutUser);

authRouter.delete(
  "/deleteuser",
  verifyToken,
  verifyQuery_DeleteUser,
  httpDeleteUser
);
