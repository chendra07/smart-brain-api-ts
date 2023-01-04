"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.openConnection = exports.sequelizeCfg = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
const { DB_NAME, DB_USER, PASSWORD, DB_HOST, DB_PORT, DB_URL } = process.env;
exports.sequelizeCfg = new sequelize_1.Sequelize(DB_URL, {
    // host: DB_HOST!,
    // port: parseInt(DB_PORT!),
    dialect: "postgres",
    omitNull: false, //false:able to commit null value
});
async function openConnection() {
    try {
        await exports.sequelizeCfg.authenticate();
        console.log("[DB - Open Connection] Connection has been established successfully.");
    }
    catch (error) {
        throw new Error("[DB - Open Connection] Unable to connect to the database: " + error);
    }
}
exports.openConnection = openConnection;
async function closeConnection() {
    try {
        await exports.sequelizeCfg.close();
        console.log("[DB - Close Connection] Connection has been closed successfully.");
    }
    catch (error) {
        throw new Error("[DB - Close Connection] Unable to close the database: " + error);
    }
}
exports.closeConnection = closeConnection;
