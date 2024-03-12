import { DataTypes } from "sequelize";
import db from "../db.js"

let Product = null

const get = () => {
    if (Product) return Product;
    Product = db.define("product", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        productname: { type: DataTypes.TEXT, allowNull: false, unique: true },
        productno: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
    });
    db.sync({force: true}).then(() => {})
    return Product
}

export default get;