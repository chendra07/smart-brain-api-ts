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
const cookie_session_1 = __importDefault(require("cookie-session"));
const keygrip_1 = __importDefault(require("keygrip"));
const router_1 = require("./router");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)()); //securing HTTP headers
const { ACCEPTED_URL, COOKIE_SESSION_KEY } = process.env;
dotenv_1.default.config();
// const whitelist = ACCEPTED_URL!.split(", ");
exports.app.use((0, cors_1.default)());
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (whitelist.indexOf(origin!) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
const sessionKeys = COOKIE_SESSION_KEY.split(", ");
const keys = new keygrip_1.default(sessionKeys, "sha256", "hex");
exports.app.use((0, cookie_session_1.default)({
    name: "session",
    maxAge: 15 * 60 * 1000,
    keys: keys,
}));
exports.app.use((0, morgan_1.default)("combined")); //http request logger
exports.app.use((0, express_fileupload_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(router_1.indexRouter);
