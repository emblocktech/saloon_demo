import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const CustomerTransaction = db.define(
    "customer_transaction",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      empID: { type: DataTypes.INTEGER, allowNull: false },
      customerName: { type: DataTypes.STRING, allowNull: false },
      customerPhoneNo: { type: DataTypes.STRING, allowNull: false },
      customerPoints: { type: DataTypes.INTEGER, allowNull: false },
      billNo: { type: DataTypes.STRING, allowNull: false, unique: true },
      billAmount: { type: DataTypes.FLOAT, allowNull: false },
      location: { type: DataTypes.TEXT, allowNull: false },
    },
    { freezeTableName: true }
  );
  await CustomerTransaction.sync({ force: false });
  return CustomerTransaction;
};

export default get;
