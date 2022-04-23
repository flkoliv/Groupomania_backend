'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user.hasMany(db.post,{onDelete: 'cascade'});
db.post.belongsTo(db.user,{onDelete: 'cascade'});
db.post.hasMany(db.comment,{onDelete: 'cascade'});
db.comment.belongsTo(db.post,{onDelete: 'cascade'});
db.user.hasMany(db.comment,{onDelete: 'cascade'});
db.comment.belongsTo(db.user,{onDelete: 'cascade'});
db.user.belongsToMany(db.post, {onDelete: 'cascade', through: 'likes'});
db.post.belongsToMany(db.user, {onDelete: 'cascade', through: 'likes'});
 
module.exports = db;
