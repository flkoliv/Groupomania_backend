const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')

// init sequelize
const db = require("./models");
db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

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
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes)

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)
app.use(helmet());

module.exports = app;