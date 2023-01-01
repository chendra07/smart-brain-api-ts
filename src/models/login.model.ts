import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

export const LoginTablePgModel = sequelizeCfg.define(
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

export const zodLoginType = z.object({
  userid: z.number(),
  email: z.string().max(100).email(),
  hash: z.string().max(100),
  isdeleted: z.boolean(),
});

type LoginTableType = z.infer<typeof zodLoginType>;
