import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

const LoginTablePgModel = sequelizeCfg.define(
  "login",
  {
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING(100),
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

export const zodLoginModel = z.object({
  email: z.string().max(100),
  hash: z.string().max(100),
  isdeleted: z.boolean(),
});

export type LoginTableModel = z.infer<typeof zodLoginModel>;

export async function matchUserLoginData(
  email: string,
  password: string
): Promise<boolean> {
  try {
    let loginUser = (await LoginTablePgModel.findOne({
      where: {
        email: email,
        isdeleted: false,
      },
      raw: true,
    })) as unknown as LoginTableModel;
    console.log("[login user]: ", loginUser);

    //TODO: Match bcrypt with current requested Password

    return false;
  } catch (error) {
    console.log("DB Error: ", error);
    return false;
  }
}

export async function createLoginUser(
  data: LoginTableModel
): Promise<LoginTableModel | string> {
  try {
    const createdUser = await LoginTablePgModel.create(data);

    console.log("createdUser: ", createdUser);

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return "Failed to create login user";
  }
}
