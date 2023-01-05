"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpChangePassword = exports.httpDeleteUser = exports.httpLogoutUser = exports.httpRefreshToken = exports.httpPostLogin = exports.httpPostRegister = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//utils
const responses_1 = require("../../../utils/responses");
const bcryptPassword_1 = require("../../../utils/bcryptPassword");
const tokenJWT_1 = require("../../../utils/tokenJWT");
const requestChecker_1 = require("../../../utils/requestChecker");
//models
const postgresDB_1 = require("../../../models/postgresDB");
const login_model_1 = require("../../../models/login.model");
const users_model_1 = require("../../../models/users.model");
const cloudinary_model_1 = require("../../../models/cloudinary.model");
async function httpPostRegister(req, res) {
    const { email, password, name } = req.body;
    const image = req.files?.image;
    let tempFileUrl;
    let tempFileName;
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        //insert to user table
        const userData = await (0, users_model_1.createNewUser)(name, email, t);
        //generate token
        const accessToken = (0, tokenJWT_1.signNewAccessToken)({
            email,
            userid: userData.userid,
        });
        const refreshToken = (0, tokenJWT_1.signNewRefreshToken)({
            email,
            userid: userData.userid,
        });
        //insert to login table
        await (0, login_model_1.createNewLogin)({
            email: email,
            hash: (0, bcryptPassword_1.hashPassword)(password),
            userid: userData.userid,
            refresh_token: refreshToken,
        }, t);
        //if user send image when register, upload the image
        if (image) {
            const { userid, name } = userData;
            const { fileName, url } = await (0, cloudinary_model_1.uploadFileCloudinary)(image, userid, name);
            tempFileUrl = url;
            tempFileName = fileName;
        }
        //update image field
        await (0, users_model_1.updateUserData)({ name: name, image: tempFileUrl }, email, t);
        return responses_1.responses.res201(req, res, {
            userid: userData.userid,
            email: email,
            image: tempFileUrl,
            name: name,
            accessToken,
            refreshToken,
        });
    })
        .catch(async (error) => {
        if (tempFileName) {
            //if registration failed and image has been uploaded, delete the file
            await (0, cloudinary_model_1.deleteFileCloudinary)(tempFileName);
            return responses_1.responses.res500(req, res, null, error.toString());
        }
    });
}
exports.httpPostRegister = httpPostRegister;
async function httpPostLogin(req, res) {
    const { email, password } = req.body;
    const loginData = await (0, login_model_1.getOneLoginData)(email);
    //verify password
    if (!loginData || !(0, bcryptPassword_1.comparePassword)(password, loginData.hash)) {
        return responses_1.responses.res403(req, res, null, "your email or password are invalid");
    }
    //generate token
    const accessToken = (0, tokenJWT_1.signNewAccessToken)({
        email: loginData.email,
        userid: loginData.userid,
    });
    const refreshToken = (0, tokenJWT_1.signNewRefreshToken)({
        email: loginData.email,
        userid: loginData.userid,
    });
    //insert refresh token to db [login]
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        await (0, login_model_1.updateLoginData)({ refresh_token: refreshToken }, loginData.email, t);
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error.toString());
    });
    //get user data
    const userData = await (0, users_model_1.getOneUser)(loginData.userid, email).then((result) => {
        const { userid, email, name, image } = result;
        return {
            userid,
            email,
            name,
            image,
        };
    });
    return responses_1.responses.res200(req, res, {
        ...userData,
        accessToken,
        refreshToken,
    }, "user login successfully");
}
exports.httpPostLogin = httpPostLogin;
async function httpRefreshToken(req, res) {
    const { refreshToken, email, userid } = req.body;
    const userLoginData = await (0, login_model_1.getOneLoginData)(email);
    if (!userLoginData) {
        return responses_1.responses.res404(req, res, null, "User not found");
    }
    if (!userLoginData.refresh_token) {
        return responses_1.responses.res404(req, res, null, "No session found, please login.");
    }
    if (refreshToken !== userLoginData.refresh_token) {
        return responses_1.responses.res403(req, res, null, "invalid refresh token");
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, userData) => {
        if (err) {
            return responses_1.responses.res403(req, res, null, "Token expired or invalid, please login again.");
        }
        const accessToken = (0, tokenJWT_1.signNewAccessToken)({
            refreshed_token: true,
            email,
            userid,
        });
        return responses_1.responses.res200(req, res, { accessToken }, "token refreshed");
    });
}
exports.httpRefreshToken = httpRefreshToken;
async function httpLogoutUser(req, res) {
    const tokenBody = req.userData;
    const { email, userid } = req.query;
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        await (0, login_model_1.updateLoginData)({ refresh_token: null }, email, t);
        return responses_1.responses.res200(req, res, null, "Logout successful");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error.toString());
    });
}
exports.httpLogoutUser = httpLogoutUser;
async function httpDeleteUser(req, res) {
    const tokenBody = req.userData;
    const { email, userid } = req.query;
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        //performing soft delete actions in Logins & Users table:
        await (0, login_model_1.updateLoginData)({ isdeleted: true }, email, t);
        await (0, users_model_1.updateUserData)({ isdeleted: true }, email, t);
        return responses_1.responses.res200(req, res, null, "User deleted successfully");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error.toString());
    });
}
exports.httpDeleteUser = httpDeleteUser;
async function httpChangePassword(req, res) {
    const tokenBody = req.userData;
    const { email, userid, newPassword, oldPassword } = req.body;
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    const loginData = await (0, login_model_1.getOneLoginData)(email);
    //if old password did not match the database: reject request
    if (!(0, bcryptPassword_1.comparePassword)(oldPassword, loginData.hash)) {
        return responses_1.responses.res403(req, res, null, "Unable to update password");
    }
    //hash new pass
    const hashNewPass = (0, bcryptPassword_1.hashPassword)(newPassword);
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        await (0, login_model_1.updateLoginData)({ hash: hashNewPass }, email, t);
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, "Unable to update password");
    });
    return responses_1.responses.res200(req, res, null, "password successfully modified");
}
exports.httpChangePassword = httpChangePassword;
