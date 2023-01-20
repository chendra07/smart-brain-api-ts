"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStringOfNumber = exports.checkParsePositive = void 0;
function checkParsePositive(target) {
    const parsed = parseInt(target);
    if (Number.isNaN(parsed) || parsed < 0) {
        return false;
    }
    return true;
}
exports.checkParsePositive = checkParsePositive;
function checkStringOfNumber(target) {
    let valid = true;
    //only accept string like this: "1,2,3,4"
    if (!target.match(/^[0-9,]+$/)) {
        valid = false;
    }
    return valid;
}
exports.checkStringOfNumber = checkStringOfNumber;
