import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

const UsersTablePgModel = sequelizeCfg.define(
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

export const zodUserModel = z.object({
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
      where: { isdeleted: false },
      raw: true,
    })) as unknown as UserTableModel[];

    return allUser;
  } catch (error) {
    console.log("DB Error: ", error);

    return "Failed to find all users";
  }
}

export async function getOneUser(id: number): Promise<UserTableModel | string> {
  try {
    let user = (await UsersTablePgModel.findOne({
      where: { id: id, isdeleted: false },
      raw: true,
    })) as unknown as UserTableModel;

    return user;
  } catch (error) {
    console.log("DB Error: ", error);

    return "Failed to find the user";
  }
}

export async function createUser(
  data: UserTableModel
): Promise<UserTableModel | string> {
  try {
    let user = await UsersTablePgModel.create(data);
    console.log("User: ", user);
    return data;
  } catch (error) {
    console.log("DB Error: ", error);
    return "Failed to create user";
  }
}
