import { DataTypes } from "sequelize";
import db from "../db.js"

let Inventory = null

const get = () => {
    if (Inventory) return Inventory;
    Inventory = db.define("inventory", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        itemname: { type: DataTypes.TEXT, allowNull: false, unique: true },
        quantityincrease: { type: DataTypes.INTEGER, allowNull: false },
        currentquantity: { type: DataTypes.INTEGER, allowNull: false },
    });
    db.sync({force: true}).then(() => {})
    return Inventory
}

export default get;