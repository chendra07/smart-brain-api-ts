import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

export const HistoryTablePgModel = sequelizeCfg.define(
  "history",
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
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

export const zodHistoryType = z.object({
  historyid: z.number().optional(),
  imageurl: z.string(),
  date: z.date(),
  userid: z.number(),
  isdeleted: z.boolean(),
});

type HistoryTableType = z.infer<typeof zodHistoryType>;

export async function userHistory(userid: number) {
  HistoryTablePgModel.findAndCountAll({
    where: { userid: userid, isdeleted: false },
  });
}
