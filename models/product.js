import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const Product = db.define(
    "product",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      itemNo: { type: DataTypes.TEXT, allowNull: false, unique: false },
      category: {type:DataTypes.TEXT, allowNull: false, unique: false},
	    parameter: {type:DataTypes.TEXT, allowNull:false, unique: false},
      itemName: { type: DataTypes.TEXT, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      price: { type: DataTypes.FLOAT, allowNull: false },
      sold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      discount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      location: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      freezeTableName: true,
    }
  );
  await Product.sync({ force: false });
  return Product;
};

export default get;
