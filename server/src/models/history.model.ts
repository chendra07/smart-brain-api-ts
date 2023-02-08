import { DataTypes, Transaction } from "sequelize";
import { z } from "zod";

import { sequelizeCfg } from "./postgresDB";

export const HistoryPgModel = sequelizeCfg.define(
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

type createUserHistoryInput = {
  imageurl: string;
  date: Date;
  userid: number;
};

export async function createUserHistory(
  data: createUserHistoryInput,
  t: Transaction | null
) {
  return HistoryPgModel.create(data, { transaction: t })
    .then((userHistories) => {
      return userHistories.dataValues as unknown as HistoryTableType;
    })
    .catch((error) => {
      console.error(error);
      throw new Error("[DB - History]: Unable to create new history data");
    });
}

export async function findAllUserHistory(
  userid: number,
  skip: number,
  limit: number
) {
  return HistoryPgModel.findAndCountAll({
    where: { userid, isdeleted: false },
    offset: skip * limit,
    limit: limit,
    order: [["date", "DESC"]],
    raw: true,
  }).then((userActiveHistories) => {
    return {
      total: userActiveHistories.count,
      data: userActiveHistories.rows as unknown as HistoryTableType[],
    };
  });
}

export async function deleteUserHistory(
  historyid: number[],
  userid: number,
  t: Transaction | null
) {
  return HistoryPgModel.update(
    {
      isdeleted: true,
    },
    { where: { historyid, userid }, transaction: t }
  )
    .then((affectedHistoryRows) => {
      return affectedHistoryRows;
    })
    .catch((error) => {
      throw new Error(
        "[DB - History]: unable to update history database, try again later"
      );
    });
}
