import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const PosMarina = db.define(
    "pos_marina",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      receipt_no: {type:DataTypes.TEXT, allowNull: false },
      timestamp: { type: DataTypes.DATE, allowNull: false },
      inv_amt: {type:DataTypes.FLOAT, allowNull:false },
      tax_amt: { type: DataTypes.FLOAT, allowNull: false },
      dis_amt: { type: DataTypes.FLOAT, allowNull: false },
      net_amt: { type: DataTypes.FLOAT, allowNull: false },
    },
    { freezeTableName: true }
  );
  await PosMarina.sync({ force: false });
  return PosMarina;
};

export default get;
