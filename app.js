const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/user');
const { Sequelize } = require('sequelize');

require('dotenv').config();
const sequelize = new Sequelize("groupomania",  process.env.mysqlUser, process.env.mysqlPassword, {
    dialect: "mysql",
    host: process.env.mysqlHost
});

try {
    sequelize.authenticate();
    console.log('Connecté à la base de données MySQL!');
} catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
}

app.use(express.json());

// header CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);



module.exports = app;