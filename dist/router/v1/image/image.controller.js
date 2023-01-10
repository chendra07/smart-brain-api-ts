"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHistory = exports.viewUserHistory = exports.detectFaceAI = void 0;
const postgresDB_1 = require("../../../models/postgresDB");
const axiosRequest_1 = require("../../../utils/axiosRequest");
const responses_1 = require("../../../utils/responses");
//model
const history_model_1 = require("../../../models/history.model");
//utils
const requestChecker_1 = require("../../../utils/requestChecker");
const { CLARIFAI_USER_ID, CLARIFAI_APP_ID, CLARIFAI_API_KEY } = process.env;
async function detectFaceAI(req, res) {
    const tokenBody = req.userData;
    const { imageUrl, email, userid } = req.body;
    const MODEL_ID = "face-detection";
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    const body = {
        user_app_id: {
            user_id: CLARIFAI_USER_ID,
            app_id: CLARIFAI_APP_ID,
        },
        inputs: [
            {
                data: {
                    image: {
                        url: imageUrl,
                    },
                },
            },
        ],
    };
    const headerCfg = {
        Authorization: "Key " + CLARIFAI_API_KEY,
    };
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        await (0, history_model_1.createHistoryEntry)({ date: new Date(), imageurl: imageUrl, userid }, t);
        const imageResult = await axiosRequest_1.axiosRequest
            .Post(`https://api.clarifai.com`, `/v2/models/${MODEL_ID}/outputs`, body, headerCfg)
            .then((result) => {
            return result.data.outputs[0].data;
        })
            .catch((error) => {
            throw new Error(error);
        });
        return responses_1.responses.res200(req, res, imageResult);
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, `[DB - history / Request Error] unable to process image, Note: ${error}`);
    });
}
exports.detectFaceAI = detectFaceAI;
async function viewUserHistory(req, res) {
    const tokenBody = req.userData;
    const { email, userid, limit, skip } = req.body;
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    const userHistory = await (0, history_model_1.findUserHistory)(userid, skip, limit);
    return responses_1.responses.res200(req, res, userHistory);
}
exports.viewUserHistory = viewUserHistory;
async function deleteHistory(req, res) {
    const tokenBody = req.userData;
    const { email, userid, historyid } = req.query;
    if (!(0, requestChecker_1.verifyTokenAndUserData)(tokenBody, email, userid)) {
        return responses_1.responses.res403(req, res, null, "User is unauthorized to access this resource");
    }
    postgresDB_1.sequelizeCfg
        .transaction(async (t) => {
        await (0, history_model_1.deleteUserHistory)(parseInt(historyid), parseInt(userid), t);
        return responses_1.responses.res200(req, res, null, "History deleted");
    })
        .catch((error) => {
        return responses_1.responses.res500(req, res, null, error);
    });
}
exports.deleteHistory = deleteHistory;
