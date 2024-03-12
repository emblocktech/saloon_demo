import { DataTypes } from "sequelize";
import db from "../db.js"

let Service = null

const get = () => {
    if (Service) return Service;
    Service = db.define("service", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        servicename: { type: DataTypes.TEXT, allowNull: false, unique: true },
        serviceno: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        price: { type: DataTypes.FLOAT, allowNull: false },
    });
    db.sync({force: true}).then(() => {})
    return Service
}

export default get;