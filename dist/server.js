"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const postgresDB_1 = require("./models/postgresDB");
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
async function startServer() {
    //run any async actions here (connect db, load csv files, etc.)
    await (0, postgresDB_1.openConnection)();
    app_1.app.listen(PORT, () => {
        console.log("listening on port: ", PORT);
    });
}
startServer();
