"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordValid = void 0;
function isPasswordValid(password) {
    const regexCfgList = [
        "(?=.*[0-9])",
        "(?=.*[!@#$%^&*_])",
        "(?=.*[a-z])",
        "(?=.*[A-Z])", //1 uppercase
    ];
    const combinedRegex = regexCfgList.join("");
    if (!password.match(combinedRegex)) {
        return false;
    }
    return true;
}
exports.isPasswordValid = isPasswordValid;
