"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidator = void 0;
function passwordValidator(password) {
    let valid = true;
    const regexCfgList = [
        "(?=.*[0-9])",
        "(?=.*[!@#$%^&*_])",
        "(?=.*[a-z])",
        "(?=.*[A-Z])", //1 uppercase
    ];
    const combinedRegex = regexCfgList.join("");
    if (!password.match(combinedRegex)) {
        valid = false;
    }
    return valid;
}
exports.passwordValidator = passwordValidator;
