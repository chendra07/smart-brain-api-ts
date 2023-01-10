import { DataTypes, Transaction } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

export const HistoryTablePgModel = sequelizeCfg.define(
  "histories",
  {
    historyid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    imageurl: {
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

type HistoryTableType = {
  historyid: number;
  imageurl: string;
  date: Date;
  userid: number;
  isdeleted: boolean;
};

type CreateHistoryEntryInput = {
  imageurl: string;
  date: Date;
  userid: number;
};

export async function createHistoryEntry(
  data: CreateHistoryEntryInput,
  t: Transaction | null
) {
  const { imageurl, date, userid } = data;
  return HistoryTablePgModel.create(
    { imageurl, date, userid },
    { transaction: t }
  )
    .then((data) => {
      return data.dataValues as unknown as HistoryTableType;
    })
    .catch((error) => {
      console.error(error);
      throw new Error("[DB - History]: Unable to create new history data");
    });
}

export async function findUserHistory(
  userid: number,
  skip: number,
  limit: number
) {
  return HistoryTablePgModel.findAll({
    where: { userid, isdeleted: false },
    offset: skip * limit,
    limit: limit,
    raw: true,
  }).then((data: unknown) => {
    console.log(data);

    return data as HistoryTableType[];
  });
}

export async function deleteUserHistory(
  historyid: number,
  userid: number,
  t: Transaction | null
) {
  return HistoryTablePgModel.update(
    {
      isdeleted: true,
    },
    { where: { historyid, userid }, transaction: t }
  )
    .then((result) => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(
        "[DB - History]: unable to update history database, try again later"
      );
    });
}
