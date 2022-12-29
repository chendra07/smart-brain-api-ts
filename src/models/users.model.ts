import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

const UsersPgModel = sequelizeCfg.define(
  "users",
  {
    id: {
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
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    joined: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export const zodUserModel = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  entries: z.string(), //reason: BIGINT return string
  joined: z.date(),
  Image: z.string(),
});

export type UserModel = z.infer<typeof zodUserModel>;

export async function getAllUsers(): Promise<UserModel[] | string> {
  try {
    let allUser = (await UsersPgModel.findAll({
      raw: true,
    })) as unknown as UserModel[];

    return allUser;
  } catch (error) {
    console.log("DB Error: ", error);

    return "Failed";
  }
}

export async function getOneUser(id: number): Promise<UserModel | string> {
  try {
    let allUser = (await UsersPgModel.findOne({
      where: { id: id },
      raw: true,
    })) as unknown as UserModel;

    return allUser;
  } catch (error) {
    console.log("DB Error: ", error);

    return "Failed";
  }
}
