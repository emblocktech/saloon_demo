import { DataTypes } from "sequelize";
import db from "../db.js";

let User = null;

const get = async () => {
    if (User) return User;
    User = db.define("user", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        customername: { type: DataTypes.TEXT, allowNull: false, unique: true },
        phonenumber: { type: DataTypes.TEXT, allowNull: false, unique: true },
        points: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    });
    await User.sync({ force: false });
    return User;
};
export default get;
