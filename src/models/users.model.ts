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
  userid: z.number(),
  name: z.string().max(100),
  email: z.string().max(100).email(),
  joined: z.date(),
  Image: z.string().optional(),
  isdeleted: z.boolean(),
});

export type UserTableType = z.infer<typeof zodUserType>;

export async function getAllUser() {
  return await UsersTablePgModel.findAll({
    where: { isdeleted: false },
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
    where: { userid: userid, isdeleted: false },
    raw: true,
  })
    .then((result: unknown) => {
      return result as UserTableType;
    })
    .catch((error) => {
      throw new Error("[DB - usersTable]: " + error);
    });
}

export async function postNewLoginUser(data: UserTableType) {
  return await UsersTablePgModel.create(data)
    .then((result: unknown) => {
      console.log("CREATE: ", result);
      return result;
    })
    .catch((error) => {
      console.error("CREATE ERROR: ", error);
      throw new Error("CREATE ERROR: " + error);
    });
}

//rollback db if error occured inside sequelize function
//const t = await sequelizeCfg.transaction();
