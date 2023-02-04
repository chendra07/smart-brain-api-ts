"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpUpdateUser = exports.httpOneUser = void 0;
//models
const cloudinary_model_1 = require("../../../models/cloudinary.model");
const users_model_1 = require("../../../models/users.model");
const postgresDB_1 = require("../../../models/postgresDB");
//utils
const responses_1 = require("../../../utils/responses");
async function httpOneUser(req, res) {
    const { email, userid } = req.tokenBody;
    return await (0, users_model_1.getOneUser)(userid, email)
        .then((result) => {
        return responses_1.responses.res200(req, res, result);
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error.toString());
    });
}
exports.httpOneUser = httpOneUser;
async function httpUpdateUser(req, res) {
    const { email, userid } = req.tokenBody;
    const { newName, deleteImage, image64 } = req.body;
    let tempUrl;
    //get user data
    const user = await (0, users_model_1.getOneUser)(userid, email);
    //if delete image is true & user data have image uploaded, delete image from cloudinary
    if (deleteImage && user.image) {
        await (0, cloudinary_model_1.deleteFileCloudinary)(`${user.userid}-${user.name}`);
        tempUrl = null;
    }
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        //if image (request) is exists
        if (!deleteImage && image64) {
            //upload new image to cloudinary
            const result = await (0, cloudinary_model_1.uploadFileCloudinary)(image64, userid, newName);
            tempUrl = result.imageUrl;
            //if image in userData exists & newName !== old name,
            //delete cloudinary file
            if (user.image && newName !== user.name) {
                await (0, cloudinary_model_1.deleteFileCloudinary)(`${user.userid}-${user.name}`);
            }
        }
        await (0, users_model_1.updateOneUser)({ image: tempUrl, name: newName }, email, userid, t);
        return responses_1.responses.res200(req, res, { image: tempUrl, name: newName }, "user data updated successfully");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, `Failed to update user data (${error})`);
    });
}
exports.httpUpdateUser = httpUpdateUser;
