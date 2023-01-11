"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBody_UpdateUser = exports.verifyQuery_OneUser = void 0;
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
const responses_1 = require("../utils/responses");
const requestChecker_1 = require("../utils/requestChecker");
const base64Checker_1 = require("../utils/base64Checker");
const zodQueryOneUser = zod_1.z.object({
    userid: zod_1.z.string(),
    email: zod_1.z.string().email(),
});
function verifyQuery_OneUser(req, res, next) {
    const verifyZod = zodQueryOneUser.safeParse(req.query);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `invalid request ${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message}`);
    }
    const { userid } = req.query;
    if (!(0, requestChecker_1.checkParsePositive)(userid)) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (userid should be a positive number)`);
    }
    next();
}
exports.verifyQuery_OneUser = verifyQuery_OneUser;
const zodBodyUpdateUser = zod_1.z.object({
    email: zod_1.z.string().email(),
    userid: zod_1.z.number().positive(),
    newName: zod_1.z.string(),
    deleteImage: zod_1.z.boolean(),
    image64: zod_1.z.string().optional(),
});
async function verifyBody_UpdateUser(req, res, next) {
    const verifyZod = zodBodyUpdateUser.safeParse(req.body);
    if (!verifyZod.success) {
        console.log(req.body);
        console.log(verifyZod.success);
        return responses_1.responses.res400(req, res, null, `invalid request ${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message}`);
    }
    const { image64 } = req.body;
    if (image64 && !(await (0, base64Checker_1.base64ImgCheck)(image64))) {
        return responses_1.responses.res400(req, res, null, "image64 extension must be png/jpg/jpeg and maximum size is 4 MB");
    }
    next();
}
exports.verifyBody_UpdateUser = verifyBody_UpdateUser;
