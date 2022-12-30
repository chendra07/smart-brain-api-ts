import { DataTypes } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

const HistoryTablePgModel = sequelizeCfg.define(
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
    },
  },
  {
    timestamps: false,
  }
);

export const zodHistoryModel = z.object({
  imageurl: z.string(),
  date: z.date(),
  userid: z.number(),
  isdeleted: z.boolean(),
});

export type HistoryTableModel = z.infer<typeof zodHistoryModel>;

export async function getUserHistory(
  userid: number
): Promise<HistoryTableModel[] | string> {
  try {
    let userHistory = (await HistoryTablePgModel.findAll({
      where: {
        userid: userid,
        isDeleted: false,
      },
      raw: true,
    })) as unknown as HistoryTableModel[];

    return userHistory;
  } catch (error) {
    console.log("DB Error: ", error);
    return "Failed to get history";
  }
}

export async function createHistory(
  data: HistoryTableModel
): Promise<HistoryTableModel | string> {
  try {
    const history = await HistoryTablePgModel.create(data);
    console.log("user: ", history);

    return data;
  } catch (error) {
    console.log("DB Error: ", error);

    return "Failed to create history";
  }
}
