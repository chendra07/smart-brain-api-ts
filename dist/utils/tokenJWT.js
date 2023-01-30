"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signNewAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = process.env;
function signNewAccessToken(data) {
    return jsonwebtoken_1.default.sign(data, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "20s",
    });
}
exports.signNewAccessToken = signNewAccessToken;
