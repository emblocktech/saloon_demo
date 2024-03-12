import express from "express"
import db from "./db.js";
import http from "http"
import bodyParser from "body-parser";
import cors from "cors"
import morgan from "morgan";
import controller from "./controller.js";

const app = express();

app.use(morgan('short'))
app.use(cors({credentials: true, origin: "*"}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Starting the database
db.authenticate().then(() => {
  console.log("Connected Successfully")
}).catch((err) => {
  console.log(err)
})

controller.start(app)

const server = http.Server(app)

// Start the server
server.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
