"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBody_ChangePassword = exports.verifyBody_Register = exports.verifyBody_Login = exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_validation_error_1 = require("zod-validation-error");
const responses_1 = require("../utils/responses");
const passwordValidator_1 = require("../utils/passwordValidator");
const base64Checker_1 = require("../utils/base64Checker");
dotenv_1.default.config();
const { JWT_SECRET } = process.env;
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    //if token exist, split the "bearer" and the token
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return responses_1.responses.res401(req, res, null, "No token detected, please login or register first");
    }
    //verify the token
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, userData) => {
        if (err) {
            return responses_1.responses.res403(req, res, null, "Token expire or invalid, try to refresh token or login");
        }
        //store decoded token body to userData
        req.userData = userData;
        next();
    });
}
exports.verifyToken = verifyToken;
//==========================================================================
const zodBodyLogin = zod_1.z.object({
    email: zod_1.z.string().max(100).email({ message: "invalid email format" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password should be 8 characters or more" }),
});
function verifyBody_Login(req, res, next) {
    const verifyZod = zodBodyLogin.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid body (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const { password } = req.body;
    const verifyPass = (0, passwordValidator_1.passwordValidator)(password);
    if (!verifyPass) {
        return responses_1.responses.res400(req, res, null, "Password did not meet the security requirement");
    }
    next();
}
exports.verifyBody_Login = verifyBody_Login;
//==========================================================================
const zodBodyRegister = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email({ message: "invalid email format" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password should be 8 characters or more" }),
    image64: zod_1.z.string().optional(),
});
async function verifyBody_Register(req, res, next) {
    const verifyZod = zodBodyRegister.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid register body (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const { password, image64 } = req.body;
    if (!(0, passwordValidator_1.passwordValidator)(password)) {
        return responses_1.responses.res400(req, res, null, "Password did not meet the security requirement");
    }
    //if base64 exists: check size & extension
    //if size or extension invalid: reject
    if (image64 && !(await (0, base64Checker_1.base64ImgCheck)(image64))) {
        return responses_1.responses.res400(req, res, null, "image64 extension must be png/jpg/jpeg and maximum size is 4 MB");
    }
    next();
}
exports.verifyBody_Register = verifyBody_Register;
//==========================================================================
const zodBodyChangePassword = zod_1.z.object({
    oldPassword: zod_1.z.string(),
    newPassword: zod_1.z.string(),
});
function verifyBody_ChangePassword(req, res, next) {
    const verifyZod = zodBodyChangePassword.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid Body (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const { newPassword, oldPassword } = req.body;
    if (!(0, passwordValidator_1.passwordValidator)(newPassword) || !(0, passwordValidator_1.passwordValidator)(oldPassword)) {
        return responses_1.responses.res400(req, res, null, "Password did not meet the security requirement");
    }
    next();
}
exports.verifyBody_ChangePassword = verifyBody_ChangePassword;
