import { DataTypes, Transaction } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

export const LoginTablePgModel = sequelizeCfg.define(
  "login",
  {
    loginid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    hash: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isdeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

//=========================================================================================

export type LoginTableType = {
  userid: number;
  isdeleted: boolean;
  email: string;
  loginid: number;
  hash: string;
};

export type createLoginInput = {
  userid: number;
  email: string;
  hash: string;
};

export async function createNewLogin(
  data: createLoginInput,
  t: Transaction | null
) {
  return await LoginTablePgModel.create(data, { transaction: t })
    .then((data) => {
      return data.dataValues as unknown as LoginTableType;
    })
    .catch((error) => {
      throw new Error(
        "[DB - Login]: Unable to create new login data, email must be unique"
      );
    });
}

export async function getOneLogin(email: string) {
  return await LoginTablePgModel.findOne({
    where: { email, isdeleted: false },
    raw: true,
  }).then((data: unknown) => {
    return data as LoginTableType;
  });
}

//=========================================================================================

type UpdateLoginInput = {
  isdeleted?: boolean;
  hash?: string;
};

export async function updateOneLogin(
  data: UpdateLoginInput,
  email: string,
  userid: number,
  t?: Transaction | null
) {
  return await LoginTablePgModel.update(data, {
    where: { email, userid, isdeleted: false },
    transaction: t,
  })
    .then((result) => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(
        "[DB - Login]: unable to update login database, try again later"
      );
    });
}

//=========================================================================================
