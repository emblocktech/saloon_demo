import { Sequelize } from "sequelize";
import constants from "./constants.js";

const sequelize = new Sequelize(constants.DB.database, constants.DB.username, constants.DB.pwd, {
    host: constants.DB.host,
    port: constants.DB.port,
    dialect: constants.DB.dialect
});


export default sequelize;