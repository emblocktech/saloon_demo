import express from "express";
import db from "./db.js";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import controller from "./controller.js";
import fs from 'fs'

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

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/pos.emblock.in/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/pos.emblock.in/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/pos.emblock.in/chain.pem', 'utf8');
//
// const credentials = {
//    key: privateKey,
//    cert: certificate,
//    ca: ca
// };

//const server = https.createServer(credentials, app);

const server = http.Server(app);
var PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
});
