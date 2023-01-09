"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpDummyReq = exports.httpUpdateUser = exports.httpOneUser = void 0;
const file_type_1 = require("file-type");
//models
const cloudinary_model_1 = require("../../../models/cloudinary.model");
const users_model_1 = require("../../../models/users.model");
const postgresDB_1 = require("../../../models/postgresDB");
//utils
const requestChecker_1 = require("../../../utils/requestChecker");
const responses_1 = require("../../../utils/responses");
async function httpOneUser(req, res) {
    const tokenBody = req.userData;
    const { userid, email } = req.body;
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    return await (0, users_model_1.getOneUser)(userid, email)
        .then((result) => {
        return responses_1.responses.res200(req, res, {
            result,
        });
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error.toString());
    });
}
exports.httpOneUser = httpOneUser;
async function httpUpdateUser(req, res) {
    const tokenBody = req.userData;
    const { userid, email, newName, deleteImage, image64 } = req.body;
    let tempUrl;
    // 6 scenarios:
    // 1: user want to update name & update image (ok)
    // 2: user want to update name & delete image (ok)
    // 3: user want to update name & but don't want to update the image (ok)
    // 4: user want to update name & but don't want to delete the image (ok)
    // 5: user don't want to update name, but update image (ok)
    // 6: user don't want to update name, but delete image (ok)
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    //get user data
    const userData = await (0, users_model_1.getOneUser)(userid, email);
    //if delete image is true & user data have image uploaded, delete image from cloudinary
    if (deleteImage && userData.image) {
        await (0, cloudinary_model_1.deleteFileCloudinary)(`${userData.userid}-${userData.name}`);
        tempUrl = null;
    }
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        //if image (request) is exists
        if (!deleteImage && image64) {
            //upload new image to cloudinary
            const result = await (0, cloudinary_model_1.uploadFileCloudinary)(image64, userid, newName);
            tempUrl = result.url;
            //if image in userData exists & newName !== old name,
            //delete cloudinary file
            if (userData.image && newName !== userData.name) {
                await (0, cloudinary_model_1.deleteFileCloudinary)(`${userData.userid}-${userData.name}`);
            }
        }
        //update new data to db users
        await (0, users_model_1.updateUserData)({ image: tempUrl, name: newName }, email, t);
        return responses_1.responses.res200(req, res, { image: tempUrl, name: newName }, "user data updated successfully");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, `Failed to update user data (${error})`);
    });
}
exports.httpUpdateUser = httpUpdateUser;
async function httpDummyReq(req, res) {
    const { image64 } = req.body;
    const x = Buffer.from(image64, "base64");
    const y = Buffer.from("nothing here...", "base64");
    const result = await (0, file_type_1.fromBuffer)(x);
    const resulty = await (0, file_type_1.fromBuffer)(y);
    console.log(y);
    console.log(resulty);
    console.log("========================");
    console.log(Buffer.byteLength(x));
    return responses_1.responses.res200(req, res, null);
}
exports.httpDummyReq = httpDummyReq;
