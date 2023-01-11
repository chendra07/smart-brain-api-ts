"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const users_middleware_1 = require("../../../middlewares/users.middleware");
exports.usersRouter = express_1.default.Router();
exports.usersRouter.get("/oneuser", users_middleware_1.verifyQuery_OneUser, users_controller_1.httpOneUser);
exports.usersRouter.put("/updateuser", users_middleware_1.verifyBody_UpdateUser, users_controller_1.httpUpdateUser);
// usersRouter.post("/dummy", httpDummyReq);
