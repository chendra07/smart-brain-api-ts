"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBody_ChangePassword = exports.verifyQuery_DeleteUser = exports.verifyQuery_Logout = exports.verifyBody_RefreshToken = exports.verifyBody_Register = exports.verifyBody_Login = exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
const responses_1 = require("../utils/responses");
const passwordValidator_1 = require("../utils/passwordValidator");
const requestChecker_1 = require("../utils/requestChecker");
dotenv_1.default.config();
const { JWT_ACCESS_SECRET } = process.env;
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    //if token exist, split the "bearer" and the token
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return responses_1.responses.res401(req, res, null, "No token detected, please login or register first");
    }
    //verify the token
    jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET, (err, userData) => {
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
});
function verifyBody_Register(req, res, next) {
    const verifyZod = zodBodyRegister.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid register body (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const { password } = req.body;
    if (!(0, passwordValidator_1.passwordValidator)(password)) {
        return responses_1.responses.res400(req, res, null, "Password did not meet the security requirement");
    }
    next();
}
exports.verifyBody_Register = verifyBody_Register;
//==========================================================================
const zodBodyRefreshToken = zod_1.z.object({
    refreshToken: zod_1.z.string(),
    email: zod_1.z.string().email(),
    userid: zod_1.z.number().positive(),
});
function verifyBody_RefreshToken(req, res, next) {
    const verifyZod = zodBodyRefreshToken.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `invalid body (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const { refreshToken } = req.body;
    const userData = jsonwebtoken_1.default.decode(refreshToken);
    req.userData = userData;
    next();
}
exports.verifyBody_RefreshToken = verifyBody_RefreshToken;
//==========================================================================
const zodQueryLogout = zod_1.z.object({
    email: zod_1.z.string().email(),
    userid: zod_1.z.string(),
});
function verifyQuery_Logout(req, res, next) {
    const verifyZod = zodQueryLogout.safeParse(req.query);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const logoutQuery = req.query;
    if (!(0, requestChecker_1.checkParsePositive)(logoutQuery.userid)) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (userid should be a positive number)`);
    }
    next();
}
exports.verifyQuery_Logout = verifyQuery_Logout;
//==========================================================================
const zodQueryDeleteUser = zod_1.z.object({
    email: zod_1.z.string().email(),
    userid: zod_1.z.string(),
});
function verifyQuery_DeleteUser(req, res, next) {
    const verifyZod = zodQueryDeleteUser.safeParse(req.query);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const logoutQuery = req.query;
    if (!(0, requestChecker_1.checkParsePositive)(logoutQuery.userid)) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (userid should be a positive number)`);
    }
    next();
}
exports.verifyQuery_DeleteUser = verifyQuery_DeleteUser;
//==========================================================================
const zodBodyChangePassword = zod_1.z.object({
    email: zod_1.z.string().email(),
    userid: zod_1.z.number().positive(),
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
