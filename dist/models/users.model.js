"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserData = exports.createNewUser = exports.getOneUser = exports.UsersTablePgModel = void 0;
const sequelize_1 = require("sequelize");
const postgresDB_1 = require("./postgresDB");
exports.UsersTablePgModel = postgresDB_1.sequelizeCfg.define("users", {
    userid: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    joined: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    isdeleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: false,
});
async function getOneUser(userid, email) {
    return await exports.UsersTablePgModel.findOne({
        where: { userid, email, isdeleted: false },
        raw: true,
    })
        .then((result) => {
        return result;
    })
        .catch((error) => {
        throw new Error("[DB - usersTable]: " + error);
    });
}
exports.getOneUser = getOneUser;
async function createNewUser(name, email, t) {
    return await exports.UsersTablePgModel.create({
        name: name,
        email: email,
        joined: new Date(),
    }, { transaction: t })
        .then((data) => {
        return data.dataValues;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - Login]: unable to insert your data");
    });
}
exports.createNewUser = createNewUser;
async function updateUserData(data, email, userid, t) {
    return await exports.UsersTablePgModel.update(data, {
        where: { email, userid, isdeleted: false },
        transaction: t,
    })
        .then((result) => {
        return true;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - Users]: unable to update user data, try again later");
    });
}
exports.updateUserData = updateUserData;
