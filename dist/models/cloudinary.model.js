"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileCloudinary = exports.uploadFileCloudinary = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const file_type_1 = require("file-type");
dotenv_1.default.config();
const { CLD_NAME, CLD_API_KEY, CLD_API_SECRET } = process.env;
const cloudinaryV2 = cloudinary_1.default.v2;
cloudinaryV2.config({
    cloud_name: CLD_NAME,
    api_key: CLD_API_KEY,
    api_secret: CLD_API_SECRET,
});
async function uploadFileCloudinary(image64, userId, userName) {
    try {
        const base64Type = await (0, file_type_1.fromBuffer)(Buffer.from(image64, "base64"));
        //get the extension from base64 string
        const dataImagePrefix = `data:image/${base64Type.ext};base64,`;
        const uploadedResponse = await cloudinaryV2.uploader.upload(`${dataImagePrefix}${image64}`, {
            upload_preset: "smart-brain-dev",
            public_id: `${userId}-${userName}`,
        });
        return {
            imageUrl: uploadedResponse.url,
            fileName: `${userId}-${userName}`,
        };
    }
    catch (error) {
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
