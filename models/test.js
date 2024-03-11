const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('saloon', 'dbman', 'dbpasswd', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres'
});
// connection check
try {
  sequelize.authenticate().then(() => { console.log('Connection has been established successfully.'); sequelize.close(); });
} catch (error) {
  console.error('Unable to connect to the database:', error);
  sequelize.close();
}

class User extends Model { }
User.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
},{
  sequelize,
  modelName:'User'
});

console.log(User,sequelize.models.User);