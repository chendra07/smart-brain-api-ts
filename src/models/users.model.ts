import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

export const UsersTablePgModel = sequelizeCfg.define(
  "users",
  {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entries: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    joined: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isdeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export const zodUserType = z.object({
  name: z.string().max(100),
  email: z.string().max(100),
  entries: z.number(),
  joined: z.date(),
  Image: z.string().optional(),
  isdeleted: z.boolean(),
});

export type UserTableType = z.infer<typeof zodUserType>;

export async function getAllUser() {
  return await UsersTablePgModel.findAll({
    raw: true,
  })
    .then((result: unknown) => {
      return result as UserTableType[];
    })
    .catch((error) => {
      throw new Error("[DB - usersTable]: " + error);
    });
}

export async function getOneUser(userid: number) {
  return await UsersTablePgModel.findOne({
    where: { userid: userid },
    raw: true,
  })
    .then((result: unknown) => {
      return result as UserTableType;
    })
    .catch((error) => {
      throw new Error("[DB - usersTable]: " + error);
    });
}

//rollback db if error occured inside sequelize function
//const t = await sequelizeCfg.transaction();
