import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const Inventory = db.define(
    "inventory",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      category: {type:DataTypes.TEXT, allowNull: false, unique: false},
      parameter: {type:DataTypes.TEXT, allowNull:false, unique: false},
      itemno: { type: DataTypes.TEXT, allowNull: false, unique: false },
      itemname: { type: DataTypes.TEXT, allowNull: false, unique: true },
      sold: { type: DataTypes.INTEGER, allowNull: false },
      available: { type: DataTypes.INTEGER, allowNull: false },
      location: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );

  await Inventory.sync({ force: false });

  return Inventory;
};
// get()
export default get;
