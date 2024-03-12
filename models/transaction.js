import { DataTypes } from "sequelize";
import db from "../db.js";

let Transaction = null;

const get = async () => {
    if (Transaction) return Transaction;
    Transaction = db.define("transaction", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        itemname: { type: DataTypes.TEXT, allowNull: false, unique: true },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        gst: { type: DataTypes.FLOAT, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
    });
    await Transaction.sync({ force: false });
    return Transaction;
};

export default get;
