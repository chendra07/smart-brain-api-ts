"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAndUserData = exports.checkParsePositive = void 0;
function checkParsePositive(target) {
    const parsed = parseInt(target);
    if (Number.isNaN(parsed) || parsed < 0) {
        return false;
    }
    return true;
}
exports.checkParsePositive = checkParsePositive;
function verifyTokenAndUserData(tokenBody, email, userid) {
    let verification = true;
    let id = userid;
    if (typeof id === "string") {
        id = parseInt(id);
    }
    if (tokenBody.email !== email) {
        verification = false;
    }
    if (tokenBody.userid !== id) {
        verification = false;
    }
    return verification;
}
exports.verifyTokenAndUserData = verifyTokenAndUserData;
