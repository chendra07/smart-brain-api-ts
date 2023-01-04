"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRouter = void 0;
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("./image.controller");
//middlewares
const image_middleware_1 = require("../../../middlewares/image.middleware");
exports.imageRouter = express_1.default.Router();
exports.imageRouter.post("/detectface", image_middleware_1.verifyBody_detectFace, image_controller_1.detectFaceAI);
exports.imageRouter.post("/history", image_middleware_1.verifyBody_ViewUserHistory, image_controller_1.viewUserHistory);
exports.imageRouter.delete("/history", image_middleware_1.verifyQuery_DeleteHistory, image_controller_1.deleteHistory);
