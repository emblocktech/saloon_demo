import customerRoute from "./controllers/customer.js";
import inventoryRoute from "./controllers/inventory.js";
import serviceRoute from "./controllers/service.js";
import productRoute from "./controllers/product.js";
import transactionRoute from "./controllers/transaction.js";
let controller = {};

controller.start = (app) => {
    app.use("/customer", customerRoute);
    app.use("/inventory", inventoryRoute);
    app.use("/service", serviceRoute);
    app.use("/product", productRoute);
    app.use("/transaction", transactionRoute);
};

export default controller;
