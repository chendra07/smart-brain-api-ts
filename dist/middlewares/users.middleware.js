"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBody_PostOneUser = void 0;
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
const responses_1 = require("../utils/responses");
const zodBodyPostOneUser = zod_1.z.object({
    userid: zod_1.z.number().positive(),
    email: zod_1.z.string().email(),
});
function verifyBody_PostOneUser(req, res, next) {
    const verifyZod = zodBodyPostOneUser.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `invalid request ${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message}`);
    }
    next();
}
exports.verifyBody_PostOneUser = verifyBody_PostOneUser;
