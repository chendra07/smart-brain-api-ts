"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyQuery_DeleteHistory = exports.verifyBody_ViewUserHistory = exports.verifyBody_detectFace = void 0;
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
const responses_1 = require("../utils/responses");
const requestChecker_1 = require("../utils/requestChecker");
const zodBodyDetectFace = zod_1.z.object({
    imageUrl: zod_1.z.string().url(),
});
function verifyBody_detectFace(req, res, next) {
    const verifyZod = zodBodyDetectFace.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid body (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    next();
}
exports.verifyBody_detectFace = verifyBody_detectFace;
//===================================================
const zodBodyViewUserHistory = zod_1.z.object({
    skip: zod_1.z.number().gte(0),
    limit: zod_1.z.number().positive(),
});
function verifyBody_ViewUserHistory(req, res, next) {
    const verifyZod = zodBodyViewUserHistory.safeParse(req.body);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid Body (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    next();
}
exports.verifyBody_ViewUserHistory = verifyBody_ViewUserHistory;
//===================================================
const zodQueryDeleteHistory = zod_1.z.object({
    historyid: zod_1.z.string(),
});
function verifyQuery_DeleteHistory(req, res, next) {
    const verifyZod = zodQueryDeleteHistory.safeParse(req.query);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const query = req.query;
    if (!(0, requestChecker_1.isStringOfNumber)(query.historyid)) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (please check your query again)`);
    }
    next();
}
exports.verifyQuery_DeleteHistory = verifyQuery_DeleteHistory;
