"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyQuery_DeleteHistory = exports.verifyBody_ViewUserHistory = exports.verifyBody_detectFace = void 0;
const zod_1 = require("zod");
const zod_validation_error_1 = require("zod-validation-error");
const responses_1 = require("../utils/responses");
const requestChecker_1 = require("../utils/requestChecker");
// export function verifyFiles_UploadImage(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.files?.image) {
//     const maxSize = 4000000; //1 MB = 1000000 Bytes (in decimal), max: 4 mb or 4,000,000 bytes
//     const { image } = req.files;
//     const userImage = image as UploadedFile;
//     const ext = extensionExtractor(userImage.name) ?? "undefined";
//     //block request if name has no extension
//     if (ext === "undefined") {
//       return responses.res400(req, res, null, "Invalid file name");
//     }
//     //block request if extension is not png, jpg, or jpeg
//     if (
//       !matchExtension(ext[ext.length - 1].substring(1), ["png", "jpg", "jpeg"])
//     ) {
//       return responses.res400(req, res, null, "Invalid file extension");
//     }
//     //block request if size limit is more than 4 mb
//     if (userImage.size >= maxSize) {
//       return responses.res400(req, res, null, "Maximum file limit is 4MB");
//     }
//   }
//   next();
// }
//===================================================
const zodBodyDetectFace = zod_1.z.object({
    imageUrl: zod_1.z.string().url(),
    userid: zod_1.z.number().positive(),
    email: zod_1.z.string().email(),
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
    email: zod_1.z.string().email(),
    userid: zod_1.z.number().positive(),
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
    email: zod_1.z.string().email(),
    userid: zod_1.z.string(),
    historyid: zod_1.z.string(),
});
function verifyQuery_DeleteHistory(req, res, next) {
    const verifyZod = zodQueryDeleteHistory.safeParse(req.query);
    if (!verifyZod.success) {
        return responses_1.responses.res400(req, res, null, `Invalid Query (${(0, zod_validation_error_1.fromZodError)(verifyZod.error).message})`);
    }
    const query = req.query;
    if (!(0, requestChecker_1.checkParsePositive)(query.userid)) {
        return responses_1.responses.res400(req, res, null, "userid should be number and positive value");
    }
    if (!(0, requestChecker_1.checkParsePositive)(query.historyid)) {
        return responses_1.responses.res400(req, res, null, "historyid should be number and positive value");
    }
    next();
}
exports.verifyQuery_DeleteHistory = verifyQuery_DeleteHistory;
//===================================================
const zodBodyDummy = zod_1.z.object({
    image64: zod_1.z.string(),
});
