// import { DataTypes } from "sequelize";
// import db from "../db.js";

// const get = async () => {
//   const Transaction = db.define(
//     "transaction",
//     {
//       id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//       billNo: { type: DataTypes.STRING, allowNull: false, unique: true },
//       empID: { type: DataTypes.INTEGER, allowNull: false },
//       customerPhoneNo: { type: DataTypes.STRING, allowNull: false },
//       customerName: { type: DataTypes.STRING, allowNull: false },
//       itemName: { type: DataTypes.TEXT, allowNull: false },
//       quantity: { type: DataTypes.INTEGER, allowNull: false },
//       price: { type: DataTypes.FLOAT, allowNull: false },
//       discount: { type: DataTypes.FLOAT, allowNull: false },
//       amount: { type: DataTypes.FLOAT, allowNull: false },
//       location: { type: DataTypes.TEXT, allowNull: false },
//     },
//     {
//       freezeTableName: true,
//     }
//   );
//   await Transaction.sync({ force: false });
//   return Transaction;
// };

// export default get;
