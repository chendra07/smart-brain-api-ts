"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHistory = exports.findUserHistory = exports.putHistoryEntry = exports.zodHistoryType = exports.HistoryTablePgModel = void 0;
const sequelize_1 = require("sequelize");
const zod_1 = require("zod");
const postgresDB_1 = require("./postgresDB");
exports.HistoryTablePgModel = postgresDB_1.sequelizeCfg.define("histories", {
    historyid: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    imageurl: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    userid: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    isdeleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: false,
});
exports.zodHistoryType = zod_1.z.object({
    historyid: zod_1.z.number().positive().optional(),
    imageurl: zod_1.z.string(),
    date: zod_1.z.date(),
    userid: zod_1.z.number().positive(),
    isdeleted: zod_1.z.boolean().optional(),
});
async function putHistoryEntry(data, t) {
    const { imageurl, date, userid } = data;
    return exports.HistoryTablePgModel.create({ imageurl, date, userid }, { transaction: t })
        .then((data) => {
        return data.dataValues;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - History]: Unable to create new history data");
    });
}
exports.putHistoryEntry = putHistoryEntry;
async function findUserHistory(userid, skip, limit) {
    return exports.HistoryTablePgModel.findAll({
        where: { userid, isdeleted: false },
        offset: skip * limit,
        limit: limit,
        raw: true,
    }).then((data) => {
        console.log(data);
        return data;
    });
}
exports.findUserHistory = findUserHistory;
async function deleteUserHistory(historyid, userid, t) {
    return exports.HistoryTablePgModel.update({
        isdeleted: true,
    }, { where: { historyid, userid }, transaction: t })
        .then((result) => {
        return true;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - History]: unable to update history database, try again later");
    });
}
exports.deleteUserHistory = deleteUserHistory;
