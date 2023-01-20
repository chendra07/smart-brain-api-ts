import express from "express";
import {
  httpPostRegister,
  httpPostLogin,
  httpLogoutUser,
  httpDeleteUser,
  httpChangePassword,
} from "./auth.controller";
import {
  verifyBody_Register,
  verifyBody_Login,
  verifyBody_ChangePassword,
  verifySession,
} from "../../../middlewares/auth.middleware";

export const authRouter = express.Router();

authRouter.post("/register", verifyBody_Register, httpPostRegister);

authRouter.post("/login", verifyBody_Login, httpPostLogin);

authRouter.delete("/logout", verifySession, httpLogoutUser);

authRouter.delete("/deleteuser", verifySession, httpDeleteUser);

authRouter.put(
  "/changepassword",
  verifySession,
  verifyBody_ChangePassword,
  httpChangePassword
);
