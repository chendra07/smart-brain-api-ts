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
  verifyQuery_Logout,
  verifyQuery_DeleteUser,
  verifyBody_ChangePassword,
} from "../../../middlewares/auth.middleware";

export const authRouter = express.Router();

authRouter.post("/register", verifyBody_Register, httpPostRegister);

authRouter.post("/login", verifyBody_Login, httpPostLogin);

authRouter.delete("/logout", verifyQuery_Logout, httpLogoutUser);

authRouter.delete("/deleteuser", verifyQuery_DeleteUser, httpDeleteUser);

authRouter.put(
  "/changepassword",
  verifyBody_ChangePassword,
  httpChangePassword
);
