import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const AppInfo = db.define(
    "app_info",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      totBill: { type: DataTypes.INTEGER },
    },
    { freezeTableName: true }
  );
  await AppInfo.sync({ force: false });
  return AppInfo;
};

export default get;

