"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = void 0;
const express_1 = __importDefault(require("express"));
//middleware
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const users_router_1 = require("./users/users.router");
const auth_router_1 = require("./auth/auth.router");
const image_router_1 = require("./image/image.router");
exports.v1Router = express_1.default.Router();
exports.v1Router.use("/auth", auth_router_1.authRouter);
exports.v1Router.use("/users", auth_middleware_1.verifyToken, users_router_1.usersRouter);
exports.v1Router.use("/image", auth_middleware_1.verifyToken, image_router_1.imageRouter);
