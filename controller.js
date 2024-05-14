import customerRoute from "./controllers/customer.js";
import inventoryRoute from "./controllers/inventory.js";
import serviceRoute from "./controllers/service.js";
import productRoute from "./controllers/product.js";
// import transactionRoute from "./controllers/transaction.js";
import customerTransactionRoute from "./controllers/customerTransactionController.js";
import productTransactionRoute from "./controllers/productTransactionController.js";
import billRoute from "./controllers/billController.js";
import authorizationmanagementRoute from "./controllers/authorizationmanagement.js";
import posMarinaRoute from "./controllers/posMarinaController.js";

let controller = {};

controller.start = (app) => {
  app.use("/customer", customerRoute);
  app.use("/inventory", inventoryRoute);
  app.use("/service", serviceRoute);
  app.use("/product", productRoute);
  // app.use("/transaction", transactionRoute);
  app.use("/customerTransaction", customerTransactionRoute);
  app.use("/productTransaction", productTransactionRoute);
  app.use("/bill", billRoute);
  app.use("/authorizationmanagement", authorizationmanagementRoute);
  app.use("/posmarina", posMarinaRoute);
};

export default controller;
