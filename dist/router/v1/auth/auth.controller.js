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
        //insert to login table
        await (0, login_model_1.createNewLogin)({
            email: email,
            hash: (0, bcryptPassword_1.hashPassword)(password),
            userid: userData.userid,
        }, t);
        //if user send image when register, upload the image
        if (image64) {
            const { userid, name } = userData;
            const { fileName, url } = await (0, cloudinary_model_1.uploadFileCloudinary)(image64, userid, name);
            tempFileUrl = url;
            tempFileName = fileName;
        }
        //update image field
        await (0, users_model_1.updateUserData)({ name: name, image: tempFileUrl }, email, userData.userid, t);
        // req.session!.user = {
        //   userid: userData.userid,
        //   email: email,
        // };
        return responses_1.responses.res201(req, res, {
            userid: userData.userid,
            email: email,
            image: tempFileUrl,
            name: name,
            token: accessToken,
        });
    })
        .catch(async (error) => {
        if (tempFileName) {
            //if registration failed and image has been uploaded, delete the file
            await (0, cloudinary_model_1.deleteFileCloudinary)(tempFileName);
        }
        return responses_1.responses.res500(req, res, null, error.toString());
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
    //get user data
    const userData = await (0, users_model_1.getOneUser)(loginData.userid, email).then((result) => {
        const { userid, email, name, image } = result;
        // req.session!.user = {
        //   userid,
        //   email,
        // };
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
//just delete JWT from client side
// export async function httpLogoutUser(req: Request, res: Response) {
//   //delete user's session
//   req.session = null;
//   return responses.res200(req, res, null, "session deleted");
// }
async function httpDeleteUser(req, res) {
    const { email, userid } = req.userData;
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        //performing soft delete actions in Logins & Users table:
        await (0, login_model_1.updateLoginData)({ isdeleted: true }, email, userid, t);
        await (0, users_model_1.updateUserData)({ isdeleted: true }, email, userid, t);
        // req.session!.user = null;
        return responses_1.responses.res200(req, res, null, "User deleted successfully");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error.toString());
    });
}
exports.httpDeleteUser = httpDeleteUser;
async function httpChangePassword(req, res) {
    const { email, userid } = req.userData;
    const { newPassword, oldPassword } = req.body;
    const loginData = await (0, login_model_1.getOneLoginData)(email);
    //if old password did not match the database: reject request
    if (!(0, bcryptPassword_1.comparePassword)(oldPassword, loginData.hash)) {
        return responses_1.responses.res403(req, res, null, "Unable to update password");
    }
    //hash new pass
    const hashNewPass = (0, bcryptPassword_1.hashPassword)(newPassword);
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        await (0, login_model_1.updateLoginData)({ hash: hashNewPass }, email, userid, t);
        return responses_1.responses.res200(req, res, null, "password successfully updated");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, "Unable to update password");
    });
}
exports.httpChangePassword = httpChangePassword;
