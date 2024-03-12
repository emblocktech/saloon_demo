import express from "express";
import db from "./db.js";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import controller from "./controller.js";

const app = express();

app.use(morgan("short"));
app.use(cors({ credentials: true, origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Starting the database
db.authenticate()
    .then(() => {
        console.log("DB Connected...");
    })
    .catch((err) => {
        console.log(err);
    });

controller.start(app);

const server = http.Server(app);
var PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
});
