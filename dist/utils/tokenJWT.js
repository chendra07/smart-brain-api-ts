"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signRefreshedAccessToken = exports.signNewRefreshToken = exports.signNewAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;
function signNewAccessToken(data) {
    return jsonwebtoken_1.default.sign(data, JWT_ACCESS_SECRET, {
        algorithm: "HS256",
        expiresIn: "10m",
    });
}
exports.signNewAccessToken = signNewAccessToken;
function signNewRefreshToken(data) {
    return jsonwebtoken_1.default.sign(data, JWT_REFRESH_SECRET, {
        algorithm: "HS256",
        expiresIn: "7d",
    });
}
exports.signNewRefreshToken = signNewRefreshToken;
function signRefreshedAccessToken(data) {
    return jsonwebtoken_1.default.sign({ ...data, refreshedToken: true }, JWT_ACCESS_SECRET, {
        algorithm: "HS256",
        expiresIn: "10m",
    });
}
exports.signRefreshedAccessToken = signRefreshedAccessToken;
