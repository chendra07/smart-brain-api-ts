"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpChangePassword = exports.httpDeleteUser = exports.httpPostLogin = exports.httpPostRegister = void 0;
//utils
const responses_1 = require("../../../utils/responses");
const tokenJWT_1 = require("../../../utils/tokenJWT");
const bcryptPassword_1 = require("../../../utils/bcryptPassword");
//models
const postgresDB_1 = require("../../../models/postgresDB");
const login_model_1 = require("../../../models/login.model");
const users_model_1 = require("../../../models/users.model");
const cloudinary_model_1 = require("../../../models/cloudinary.model");
async function httpPostRegister(req, res) {
    const { email, password, name, image64 } = req.body;
    let tempImageUrl;
    let tempFileName;
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        //insert to user table
        const newUser = await (0, users_model_1.createOneUser)(name, email, t);
        //generate token
        const accessToken = (0, tokenJWT_1.signNewAccessToken)({
            email,
            userid: newUser.userid,
        });
        //insert to login table
        await (0, login_model_1.createNewLogin)({
            email: email,
            hash: (0, bcryptPassword_1.hashPassword)(password),
            userid: newUser.userid,
        }, t);
        //if user send image when register, upload the image
        if (image64) {
            const { userid, name } = newUser;
            const { fileName, imageUrl } = await (0, cloudinary_model_1.uploadFileCloudinary)(image64, userid, name);
            tempImageUrl = imageUrl;
            tempFileName = fileName;
        }
        //update image field
        await (0, users_model_1.updateOneUser)({ name: name, image: tempImageUrl }, email, newUser.userid, t);
        return responses_1.responses.res201(req, res, {
            userid: newUser.userid,
            email: email,
            image: tempImageUrl,
            name: name,
            token: accessToken,
        });
    })
        .catch(async (error) => {
        if (tempFileName) {
            //if registration failed and image has been uploaded: delete the file
            await (0, cloudinary_model_1.deleteFileCloudinary)(tempFileName);
        }
        return responses_1.responses.res500(req, res, null, error.toString());
    });
}
exports.httpPostRegister = httpPostRegister;
async function httpPostLogin(req, res) {
    const { email, password } = req.body;
    const loginData = await (0, login_model_1.getOneLogin)(email);
    //verify password
    if (!loginData || !(0, bcryptPassword_1.comparePassword)(password, loginData.hash)) {
        return responses_1.responses.res403(req, res, null, "your email or password are invalid");
    }
    //get user data
    const userData = await (0, users_model_1.getOneUser)(loginData.userid, email).then((result) => {
        const { userid, email, name, image } = result;
        const accessToken = (0, tokenJWT_1.signNewAccessToken)({
            email,
            userid: userid,
        });
        return {
            userid,
            email,
            name,
            image,
            token: accessToken,
        };
    });
    return responses_1.responses.res200(req, res, userData, "user login successfully");
}
exports.httpPostLogin = httpPostLogin;
async function httpDeleteUser(req, res) {
    const { email, userid } = req.tokenBody;
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        //performing soft delete actions in Logins & Users table:
        await (0, login_model_1.updateOneLogin)({ isdeleted: true }, email, userid, t);
        await (0, users_model_1.updateOneUser)({ isdeleted: true }, email, userid, t);
        return responses_1.responses.res200(req, res, null, "User deleted successfully");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error.toString());
    });
}
exports.httpDeleteUser = httpDeleteUser;
async function httpChangePassword(req, res) {
    const { email, userid } = req.tokenBody;
    const { newPassword, oldPassword } = req.body;
    const loginData = await (0, login_model_1.getOneLogin)(email);
    //if old password did not match the database: reject request
    if (!(0, bcryptPassword_1.comparePassword)(oldPassword, loginData.hash)) {
        return responses_1.responses.res403(req, res, null, "Unable to update password");
    }
    //hash new pass
    const hashNewPass = (0, bcryptPassword_1.hashPassword)(newPassword);
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        await (0, login_model_1.updateOneLogin)({ hash: hashNewPass }, email, userid, t);
        return responses_1.responses.res200(req, res, null, "password successfully updated");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, "Unable to update password");
    });
}
exports.httpChangePassword = httpChangePassword;
