"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const image_middleware_1 = require("../../../middlewares/image.middleware");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/register", auth_middleware_1.verifyBody_Register, image_middleware_1.verifyFiles_UploadImage, auth_controller_1.httpPostRegister);
exports.authRouter.post("/login", auth_middleware_1.verifyBody_Login, auth_controller_1.httpPostLogin);
exports.authRouter.put("/refreshtoken", auth_middleware_1.verifyBody_RefreshToken, auth_controller_1.httpRefreshToken);
exports.authRouter.delete("/logout", auth_middleware_1.verifyToken, auth_middleware_1.verifyQuery_Logout, auth_controller_1.httpLogoutUser);
exports.authRouter.delete("/deleteuser", auth_middleware_1.verifyToken, auth_middleware_1.verifyQuery_DeleteUser, auth_controller_1.httpDeleteUser);
exports.authRouter.put("/changepassword", auth_middleware_1.verifyToken, auth_middleware_1.verifyBody_ChangePassword, auth_controller_1.httpChangePassword);
