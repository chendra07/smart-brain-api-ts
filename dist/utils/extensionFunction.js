"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchExtension = exports.extensionExtractor = void 0;
function extensionExtractor(fileName) {
    return fileName.match(/\.[0-9a-z]+$/i);
}
exports.extensionExtractor = extensionExtractor;
function matchExtension(targetFile, matches) {
    //match target with specified extension
    if (!targetFile.match(`\\b${matches.join("|")}\\b`)) {
        return false;
    }
    return true;
}
exports.matchExtension = matchExtension;
