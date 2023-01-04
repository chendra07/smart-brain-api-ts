"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileCloudinary = exports.uploadFileCloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const extensionFunction_1 = require("../utils/extensionFunction");
const { CLD_NAME, CLD_API_KEY, CLD_API_SECRET } = process.env;
const cloudinaryV2 = cloudinary_1.default.v2;
cloudinaryV2.config({
    cloud_name: CLD_NAME,
    api_key: CLD_API_KEY,
    api_secret: CLD_API_SECRET,
});
async function uploadFileCloudinary(image, userId, userName) {
    try {
        const ext = (0, extensionFunction_1.extensionExtractor)(image.name);
        //get the extension & removing "." (dot) from regex result
        const dataImagePrefix = `data:image/${ext[ext.length - 1].substring(1)};base64,`;
        //convert image buffer to base64 string
        const base64File = image.data.toString("base64");
        const uploadedResponse = await cloudinaryV2.uploader.upload(`${dataImagePrefix}${base64File}`, {
            upload_preset: "smart-brain-dev",
            public_id: `${userId}-${userName}`,
        });
        return {
            url: uploadedResponse.url,
            fileName: `${userId}-${userName}`,
        };
    }
    catch (error) {
        console.error(error);
        throw new Error("[Cloudinary - Upload]: Failed to upload image");
    }
}
exports.uploadFileCloudinary = uploadFileCloudinary;
async function deleteFileCloudinary(fileName) {
    try {
        await cloudinaryV2.uploader.destroy("smart-brain-user-profiles/" + fileName);
    }
    catch (error) {
        throw new Error("[Cloudinary]: Failed to delete file");
    }
}
exports.deleteFileCloudinary = deleteFileCloudinary;
