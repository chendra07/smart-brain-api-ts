import { DataTypes, Transaction } from "sequelize";
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    joined: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
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

export type UserTableType = {
  userid: number;
  email: string;
  isdeleted: boolean;
  name: string;
  joined: Date;
  image: string | null;
};

export async function getOneUser(userid: number, email: string) {
  return await UsersTablePgModel.findOne({
    where: { userid, email, isdeleted: false },
    raw: true,
  })
    .then((result: unknown) => {
      return result as UserTableType;
    })
    .catch((error) => {
      throw new Error("[DB - usersTable]: " + error);
    });
}

export async function createNewUser(
  name: string,
  email: string,
  t: Transaction | null
) {
  return await UsersTablePgModel.create(
    {
      name: name,
      email: email,
      joined: new Date(),
    },
    { transaction: t }
  )
    .then((data) => {
      return data.dataValues as unknown as UserTableType;
    })
    .catch((error) => {
      console.error(error);
      throw new Error("[DB - Login]: unable to insert your data");
    });
}

type UpdateUserInput = {
  image?: string | null;
  isdeleted?: boolean;
  name?: string;
};

export async function updateUserData(
  data: UpdateUserInput,
  email: string,
  userid: number,
  t: Transaction | null
) {
  return await UsersTablePgModel.update(data, {
    where: { email, userid, isdeleted: false },
    transaction: t,
  })
    .then((result) => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(
        "[DB - Users]: unable to update user data, try again later"
      );
    });
}
