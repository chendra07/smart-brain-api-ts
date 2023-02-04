"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringOfNumber = exports.isParsedPositive = void 0;
function isParsedPositive(target) {
    const parsed = parseInt(target);
    if (Number.isNaN(parsed) || parsed < 0) {
        return false;
    }
    return true;
}
exports.isParsedPositive = isParsedPositive;
function isStringOfNumber(target) {
    //only accept string like this: "1,2,3,4"
    if (!target.match(/^[0-9,]+$/)) {
        return false;
    }
    return true;
}
exports.isStringOfNumber = isStringOfNumber;
