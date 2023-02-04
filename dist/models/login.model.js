"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneLogin = exports.getOneLogin = exports.createNewLogin = exports.LoginPgModel = void 0;
const sequelize_1 = require("sequelize");
const postgresDB_1 = require("./postgresDB");
exports.LoginPgModel = postgresDB_1.sequelizeCfg.define("login", {
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
}, {
    timestamps: false,
});
async function createNewLogin(newLoginInput, t) {
    return await exports.LoginPgModel.create(newLoginInput, { transaction: t })
        .then((newLogin) => {
        return newLogin.dataValues;
    })
        .catch((error) => {
        throw new Error("[DB - Login]: Unable to create new login data, email must be unique");
    });
}
exports.createNewLogin = createNewLogin;
async function getOneLogin(email) {
    return await exports.LoginPgModel.findOne({
        where: { email, isdeleted: false },
        raw: true,
    }).then((activeLoginFound) => {
        return activeLoginFound;
    });
}
exports.getOneLogin = getOneLogin;
async function updateOneLogin(loginInput, email, userid, t) {
    return await exports.LoginPgModel.update(loginInput, {
        where: { email, userid, isdeleted: false },
        transaction: t,
    })
        .then((affectedLoginRows) => {
        return affectedLoginRows;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - Login]: unable to update login database, try again later");
    });
}
exports.updateOneLogin = updateOneLogin;
//=========================================================================================
