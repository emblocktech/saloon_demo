import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const ProductTransaction = db.define(
    "product_transaction",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      category: {type:DataTypes.TEXT, allowNull: false, unique: false},
      parameter: {type:DataTypes.TEXT, allowNull:false, unique: false},
      empID: { type: DataTypes.TEXT, allowNull: false },
      itemNo: { type: DataTypes.STRING, allowNull: false },
      itemName: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      billNo: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.TEXT, allowNull: false },
    },
    { freezeTableName: true }
  );
  await ProductTransaction.sync({ force: false });
  return ProductTransaction;
};

export default get;
