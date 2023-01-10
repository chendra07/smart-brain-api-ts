"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLoginData = exports.getOneLoginData = exports.createNewLogin = exports.LoginTablePgModel = void 0;
const sequelize_1 = require("sequelize");
const postgresDB_1 = require("./postgresDB");
exports.LoginTablePgModel = postgresDB_1.sequelizeCfg.define("login", {
    loginid: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    hash: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    isdeleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    refresh_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: false,
    },
}, {
    timestamps: false,
});
async function createNewLogin(data, t) {
    return await exports.LoginTablePgModel.create(data, { transaction: t })
        .then((data) => {
        return data.dataValues;
    })
        .catch((error) => {
        throw new Error("[DB - Login]: Unable to create new login data, email must be unique");
    });
}
exports.createNewLogin = createNewLogin;
async function getOneLoginData(email) {
    return await exports.LoginTablePgModel.findOne({
        where: { email, isdeleted: false },
        raw: true,
    }).then((data) => {
        return data;
    });
}
exports.getOneLoginData = getOneLoginData;
async function updateLoginData(data, email, t) {
    return await exports.LoginTablePgModel.update(data, {
        where: { email, isdeleted: false },
        transaction: t,
    })
        .then((result) => {
        return true;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - Login]: unable to update login database, try again later");
    });
}
exports.updateLoginData = updateLoginData;
//=========================================================================================
