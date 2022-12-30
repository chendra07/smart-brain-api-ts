import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

const UsersTablePgModel = sequelizeCfg.define(
  "users",
  {
    historyid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

export const zodUserModel = z.object({
  userid: z.number(),
  name: z.string().max(100),
  email: z.string().max(100),
  entries: z.number(),
  joined: z.date(),
  Image: z.string().optional(),
  isdeleted: z.boolean(),
});

export type UserTableModel = z.infer<typeof zodUserModel>;

export async function getAllUsers(): Promise<UserTableModel[] | string> {
  try {
    let allUser = (await UsersTablePgModel.findAll({
      raw: true,
    })) as unknown as UserTableModel[];

    return allUser;
  } catch (error) {
    console.log("DB Error: ", error);

    return "Failed";
  }
}

export async function getOneUser(id: number): Promise<UserTableModel | string> {
  try {
    let allUser = (await UsersTablePgModel.findOne({
      where: { id: id },
      raw: true,
    })) as unknown as UserTableModel;

    return allUser;
  } catch (error) {
    console.log("DB Error: ", error);

    return "Failed";
  }
}
