"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchExtension = exports.extensionExtractor = void 0;
function extensionExtractor(fileName) {
    return fileName.match(/\.[0-9a-z]+$/i);
}
exports.extensionExtractor = extensionExtractor;
function matchExtension(targetFile, matches) {
    //match target with specified extension
    const result = targetFile.match(`\\b${matches.join("|")}\\b`);
    console.log("result EXT: ", !result);
    if (!result) {
        return false;
    }
    return true;
}
exports.matchExtension = matchExtension;
