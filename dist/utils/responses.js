"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responses = void 0;
//OK
function res200(req, res, body, message) {
    return res.status(200).json({
        message: message ?? "OK",
        data: body,
    });
}
//Created
function res201(req, res, body, message) {
    return res.status(201).json({
        message: message ?? "Created",
        data: body,
    });
}
//Bad Request
function res400(req, res, body, message) {
    return res.status(400).json({
        message: message ?? "Bad Request",
        data: body,
    });
}
//Unauthorized
function res401(req, res, body, message) {
    return res.status(401).json({
        message: message ?? "Unauthorized",
        data: body,
    });
}
//Forbidden
function res403(req, res, body, message) {
    return res.status(403).json({
        message: message ?? "Forbidden",
        data: body,
    });
}
//Not Found
function res404(req, res, body, message) {
    return res.status(404).json({
        message: message ?? "Not Found",
        data: body,
    });
}
//Method Not Allowed
function res405(req, res, body, message) {
    return res.status(405).json({
        message: message ?? "Method Not Allowed",
        data: body,
    });
}
//Request Timeout
function res408(req, res, body, message) {
    return res.status(408).json({
        message: message ?? "Request Timeout",
        data: body,
    });
}
//Conflict
function res409(req, res, body, message) {
    return res.status(409).json({
        message: message ?? "Conflict",
        data: body,
    });
}
//Too Many Request
function res429(req, res, body, message) {
    return res.status(429).json({
        message: message ?? "Too Many Request",
        data: body,
    });
}
//Login Time-out
function res440(req, res, body, message) {
    return res.status(440).json({
        message: message ?? "Login Time-out",
        data: body,
    });
}
//Internal Server Error
function res500(req, res, body, message) {
    return res.status(500).json({
        message: message ?? "Internal Server Error",
        data: body,
    });
}
//Bad Gateway
function res502(req, res, body, message) {
    return res.status(502).json({
        message: message ?? "Bad Gateway",
        data: body,
    });
}
//Network Authentication Required
function res511(req, res, body, message) {
    return res.status(511).json({
        message: message ?? "Network Authentication Required",
        data: body,
    });
}
exports.responses = {
    res200,
    res201,
    res400,
    res401,
    res403,
    res404,
    res405,
    res408,
    res409,
    res429,
    res440,
    res500,
    res502,
    res511,
};
