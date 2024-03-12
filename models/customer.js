import { DataTypes } from "sequelize";
import db from "../db.js"

let User = null

const get = () => {
    if (User) return User;
    User = db.define("user", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        customername: { type: DataTypes.TEXT, allowNull: false, unique: true },
        phonenumber: { type: DataTypes.TEXT, allowNull: false, unique: true },
        points: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    });
    db.sync({force: true}).then(() => {})
    return User
}

export default get;