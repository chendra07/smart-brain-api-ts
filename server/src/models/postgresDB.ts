import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";

dotenv.config();

const { DB_NAME, DB_USER, PASSWORD, DB_HOST, DB_PORT, DB_URL } = process.env;

export const sequelizeCfg = new Sequelize(DB_URL!, {
  // host: DB_HOST!,
  // port: parseInt(DB_PORT!),
  dialect: "postgres",
  omitNull: false, //false:able to commit null value
});

export async function openConnection() {
  try {
    await sequelizeCfg.authenticate();
    console.log(
      "[DB - Open Connection] Connection has been established successfully."
    );
  } catch (error) {
    throw new Error(
      "[DB - Open Connection] Unable to connect to the database: " + error
    );
  }
}

export async function closeConnection() {
  try {
    await sequelizeCfg.close();
    console.log(
      "[DB - Close Connection] Connection has been closed successfully."
    );
  } catch (error) {
    throw new Error(
      "[DB - Close Connection] Unable to close the database: " + error
    );
  }
}
