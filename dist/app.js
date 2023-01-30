"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = require("./router");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)()); //securing HTTP headers
const { ACCEPTED_URL, JWT_SECRET } = process.env;
dotenv_1.default.config();
const whitelist = ACCEPTED_URL.split(", ");
exports.app.use((0, cors_1.default)({
    credentials: true,
    origin: whitelist,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
// const sessionKeys = COOKIE_SESSION_KEY!.split(", ");
// const keys = new Keygrip(sessionKeys, "sha256", "hex");
// app.use(
//   cookieSession({
//     name: "session",
//     maxAge: 15 * 60 * 1000,
//     keys: keys,
//   })
// );
exports.app.use((0, morgan_1.default)("combined")); //http request logger
exports.app.use((0, express_fileupload_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(router_1.indexRouter);
