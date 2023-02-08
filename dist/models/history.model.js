"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHistory = exports.findAllUserHistory = exports.createUserHistory = exports.HistoryPgModel = void 0;
const sequelize_1 = require("sequelize");
const postgresDB_1 = require("./postgresDB");
exports.HistoryPgModel = postgresDB_1.sequelizeCfg.define("histories", {
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
async function createUserHistory(data, t) {
    return exports.HistoryPgModel.create(data, { transaction: t })
        .then((userHistories) => {
        return userHistories.dataValues;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - History]: Unable to create new history data");
    });
}
exports.createUserHistory = createUserHistory;
async function findAllUserHistory(userid, skip, limit) {
    return exports.HistoryPgModel.findAndCountAll({
        where: { userid, isdeleted: false },
        offset: skip * limit,
        limit: limit,
        order: [["date", "DESC"]],
        raw: true,
    }).then((userActiveHistories) => {
        return {
            total: userActiveHistories.count,
            data: userActiveHistories.rows,
        };
    });
}
exports.findAllUserHistory = findAllUserHistory;
async function deleteUserHistory(historyid, userid, t) {
    return exports.HistoryPgModel.update({
        isdeleted: true,
    }, { where: { historyid, userid }, transaction: t })
        .then((affectedHistoryRows) => {
        return affectedHistoryRows;
    })
        .catch((error) => {
        throw new Error("[DB - History]: unable to update history database, try again later");
    });
}
exports.deleteUserHistory = deleteUserHistory;
