const TARGET = "LOCAL" // LOCAL or PRO

const DB = {
    database: "saloon",
    username: "root",
    pwd: TARGET === "PRO" ? "FemiGa@123H" : "root",
    host: TARGET === "PRO" ? "167.71.239.134" : "127.0.0.1",
    port: 3306,
    dialect: "mysql",
};

const MAIL_TEST = {
    mail: "sriramkesavan44@gmail.com",
    pass: "lexc odin hdvq irob"
}

const MAIL_PRO = {
    mail: "femigamarina@gmail.com",
    pass: "ejms zxtj smgb owgr"
}

export default { DB, MAIL_PRO, MAIL_TEST,TARGET };
