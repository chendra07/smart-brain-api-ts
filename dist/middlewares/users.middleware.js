"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBody_UpdateUser = void 0;
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
const responses_1 = require("../utils/responses");
const base64Checker_1 = require("../utils/base64Checker");
//===================================================================================
const zodBodyUpdateUser = zod_1.z.object({
    newName: zod_1.z.string(),
    deleteImage: zod_1.z.boolean(),
    image64: zod_1.z.string().optional(),
});
async function verifyBody_UpdateUser(req, res, next) {
    const verifyZod = zodBodyUpdateUser.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `invalid request ${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message}`);
    }
    const { image64 } = req.body;
    if (image64 &&
        !(await (0, base64Checker_1.isBase64ImageValid)(image64, 4000000, [
            "image/webp",
            "image/png",
            "image/jpg",
            "image/jpeg",
        ]))) {
        return responses_1.responses.res400(req, res, null, "image64 extension must be png/jpg/jpeg and maximum size is 4 MB");
    }
    next();
}
exports.verifyBody_UpdateUser = verifyBody_UpdateUser;
