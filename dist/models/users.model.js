"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneUser = exports.createOneUser = exports.getOneUser = exports.UsersPgModel = void 0;
const sequelize_1 = require("sequelize");
const postgresDB_1 = require("./postgresDB");
exports.UsersPgModel = postgresDB_1.sequelizeCfg.define("users", {
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
    return await exports.UsersPgModel.findOne({
        where: { userid, email, isdeleted: false },
        raw: true,
    })
        .then((activeUserFound) => {
        return activeUserFound;
    })
        .catch((error) => {
        throw new Error("[DB - usersTable]: " + error);
    });
}
exports.getOneUser = getOneUser;
async function createOneUser(name, email, t) {
    return await exports.UsersPgModel.create({
        name: name,
        email: email,
        joined: new Date(),
    }, { transaction: t })
        .then((newUser) => {
        return newUser.dataValues;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - Login]: unable to insert your data");
    });
}
exports.createOneUser = createOneUser;
async function updateOneUser(data, email, userid, t) {
    return await exports.UsersPgModel.update(data, {
        where: { email, userid, isdeleted: false },
        transaction: t,
    })
        .then((affectedUsersRows) => {
        return affectedUsersRows;
    })
        .catch((error) => {
        console.error(error);
        throw new Error("[DB - Users]: unable to update user data, try again later");
    });
}
exports.updateOneUser = updateOneUser;
