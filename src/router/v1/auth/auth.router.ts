import express from "express";
import {
  httpPostRegister,
  httpPostLogin,
  httpRefreshToken,
  httpLogoutUser,
  httpDeleteUser,
  httpChangePassword,
} from "./auth.controller";
import {
  verifyBody_Register,
  verifyBody_Login,
  verifyBody_RefreshToken,
  verifyQuery_Logout,
  verifyQuery_DeleteUser,
  verifyBody_ChangePassword,
  verifyToken,
} from "../../../middlewares/auth.middleware";

export const authRouter = express.Router();

authRouter.post("/register", verifyBody_Register, httpPostRegister);

authRouter.post("/login", verifyBody_Login, httpPostLogin);

authRouter.put("/refreshtoken", verifyBody_RefreshToken, httpRefreshToken);

authRouter.delete("/logout", verifyToken, verifyQuery_Logout, httpLogoutUser);

authRouter.delete(
  "/deleteuser",
  verifyToken,
  verifyQuery_DeleteUser,
  httpDeleteUser
);

authRouter.put(
  "/changepassword",
  verifyToken,
  verifyBody_ChangePassword,
  httpChangePassword
);
