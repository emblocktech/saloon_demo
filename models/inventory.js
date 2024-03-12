import { DataTypes } from "sequelize";
import db from "../db.js";

let Inventory = null;
const get = async () => {
    if (Inventory) return Inventory;
    Inventory = db.define("inventory", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        itemname: { type: DataTypes.TEXT, allowNull: false, unique: true },
        quantityincrease: { type: DataTypes.INTEGER, allowNull: false },
        currentquantity: { type: DataTypes.INTEGER, allowNull: false },
    });
    await Inventory.sync({ force: false });
    return Inventory;
};
// get()
export default get;
