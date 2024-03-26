import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const User = db.define(
    "customers",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      customername: { type: DataTypes.TEXT, allowNull: false },
      phonenumber: { type: DataTypes.TEXT, allowNull: false },
      points: { type: DataTypes.INTEGER, allowNull: false },
      
    },
    {
      timestamps: false, // Disable createdAt and updatedAt timestamps
      freezeTableName: true,
    }
  );

  await User.sync({ force: false });

  return User;
};

export default get;
