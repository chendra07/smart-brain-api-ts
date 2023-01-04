"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
const { BCRYPT_SALT } = process.env;
function hashPassword(password) {
    const salt = (0, bcrypt_1.genSaltSync)(parseInt(BCRYPT_SALT));
    const hash = (0, bcrypt_1.hashSync)(password, salt);
    return hash;
}
exports.hashPassword = hashPassword;
function comparePassword(password, hash) {
    return (0, bcrypt_1.compareSync)(password, hash);
}
exports.comparePassword = comparePassword;
