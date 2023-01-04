"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const renderHeaders = (headerCfg, uploadFile) => {
    let header;
    header = {
        "Content-Type": uploadFile ? "multipart/form-data" : "application/json",
    };
    if (headerCfg) {
        header = { ...header, ...headerCfg };
    }
    return header;
};
//generate query based on given object
function generateQueryParams(request) {
    let listOfQuery = [];
    Object.keys(request).forEach((item, index) => {
        let keyObj = item;
        listOfQuery.push(`${[item]}=${request[keyObj]}`);
    });
    return listOfQuery;
}
//zod used for validation when using axios
const zodAxiosConfig = zod_1.z.object({
    method: zod_1.z.enum(["get", "post", "put", "delete"]),
    baseURL: zod_1.z.string(),
    url: zod_1.z.string(),
    data: zod_1.z.any().optional(),
    headers: zod_1.z.object({
        "Content-Type": zod_1.z.string(),
    }),
});
function axiosPromise(axiosConfig) {
    return new Promise((resolve, reject) => {
        (0, axios_1.default)(axiosConfig)
            .then((resp) => {
            return resolve(resp);
        })
            .catch((error) => {
            console.error(error);
            return reject(`(${axiosConfig.method.toUpperCase()}): ${error}`);
        });
    });
}
async function Get(baseUrl, path, headerCfg, paramsObj) {
    const headers = renderHeaders(headerCfg);
    let queryParams = [];
    if (paramsObj) {
        queryParams = generateQueryParams(paramsObj);
    }
    const getAxiosConfig = {
        method: "get",
        baseURL: baseUrl ?? process.env.API_URL,
        url: `${path}?${queryParams.join("&") || ""}`,
        headers,
    };
    const promise = axiosPromise(getAxiosConfig);
    return promise;
}
async function Post(baseUrl, path, sendData, headerCfg, paramsObj, uploadFile) {
    const headers = renderHeaders(headerCfg, uploadFile);
    let queryParams = [];
    if (paramsObj) {
        queryParams = generateQueryParams(paramsObj);
    }
    const postAxiosConfig = {
        method: "post",
        baseURL: baseUrl ?? process.env.API_URL,
        url: `${path}?${queryParams.join("&") || ""}`,
        data: sendData,
        headers,
    };
    const promise = axiosPromise(postAxiosConfig);
    return promise;
}
async function Put(baseUrl, path, sendData, headerCfg, paramsObj, uploadFile) {
    const headers = renderHeaders(headerCfg, uploadFile);
    let queryParams = [];
    if (paramsObj) {
        queryParams = generateQueryParams(paramsObj);
    }
    const putAxiosConfig = {
        method: "put",
        baseURL: baseUrl ?? process.env.API_URL,
        url: `${path}?${queryParams.join("&") || ""}`,
        data: sendData,
        headers,
    };
    const promise = axiosPromise(putAxiosConfig);
    return promise;
}
async function Delete(baseUrl, path, headerCfg, paramsObj) {
    const headers = renderHeaders(headerCfg);
    let queryParams = [];
    if (paramsObj) {
        queryParams = generateQueryParams(paramsObj);
    }
    const deleteAxiosConfig = {
        method: "delete",
        baseURL: baseUrl ?? process.env.API_URL,
        url: `${path}?${queryParams.join("&") || ""}`,
        headers,
    };
    const promise = axiosPromise(deleteAxiosConfig);
    return promise;
}
exports.axiosRequest = {
    Get,
    Post,
    Put,
    Delete,
};
