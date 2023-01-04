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
      type: DataTypes.STRING(100),
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

export const zodUserType = z.object({
  userid: z.number().positive().optional(),
  name: z.string().max(100),
  email: z.string().max(100).email(),
  joined: z.date(),
  image: z.string().optional(),
  isdeleted: z.boolean().optional(),
});

export type UserTableType = z.infer<typeof zodUserType>;

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
  image?: string | undefined;
  isdeleted?: boolean | undefined;
  name?: string;
};

export async function updateUserData(
  data: UpdateUserInput,
  email: string,
  t: Transaction | null
) {
  return await UsersTablePgModel.update(data, {
    where: { email, isdeleted: false },
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
