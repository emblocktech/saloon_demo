import { DataTypes } from "sequelize";
import db from "../db.js";

const get = async () => {
  const admins = db.define(
    "administration",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: DataTypes.TEXT, allowNull: false },
      password: { type: DataTypes.TEXT, allowNull: false },
      profile: { type: DataTypes.TEXT, allowNull: false },
      email: { type: DataTypes.TEXT, allowNull: false },
      location: { type: DataTypes.TEXT, allowNull: false }
    },
    {
      timestamps: false, // Disable createdAt and updatedAt timestamps
      freezeTableName: true,
    }
  );

  await admins.sync({ force: false });

  return admins;
};

export default get;
