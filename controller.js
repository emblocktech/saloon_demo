import customerRoute from "./controllers/customer.js"

let controller = {}

controller.start = (app) => {
    app.use("/customer", customerRoute)
}

export default controller;