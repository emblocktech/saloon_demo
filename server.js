import express from "express";
import db from "./db.js";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import controller from "./controller.js";
import fs from 'fs'
import getAuthMan from './models/authorizationmanagement.js';
import constants from "./constants.js";
import bcrypt from "bcrypt";
async function checkAdmin(){
    const authMan = await getAuthMan(); 
    var flag = false;
    const creds = await authMan.findAll();
    creds.forEach((e)=>{
        console.log(e.username)
        if (e.username == "admin"){
            flag=true;
        }
    });
    if (!flag){
        await authMan.create({
            username: "admin",
            password: await bcrypt.hash("admin",10),
            profile: "SuperAdmin",
            email: "sriramkesavan44@gmail.com",
            location: "All"
        })
    }
}

checkAdmin();
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
let server;

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/pos.emblock.in/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/pos.emblock.in/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/pos.emblock.in/chain.pem', 'utf8');

// const credentials = {
// key: privateKey,
// cert: certificate,
// ca: ca
// };

// server = https.createServer(credentials, app);
server = http.Server(app);

var PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
});
