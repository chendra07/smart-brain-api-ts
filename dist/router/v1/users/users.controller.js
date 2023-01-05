"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpPostOneUser = void 0;
const responses_1 = require("../../../utils/responses");
const users_model_1 = require("../../../models/users.model");
//utils
const requestChecker_1 = require("../../../utils/requestChecker");
async function httpPostOneUser(req, res) {
    const tokenBody = req.userData;
    const { userid, email } = req.body;
    console.log(tokenBody);
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
exports.httpPostOneUser = httpPostOneUser;
