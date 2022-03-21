const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// Création d'un compte
exports.signup = (req, res, next) => {
    if (validator.isStrongPassword(req.body.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,
                    email: req.body.email,
                    password: hash
                };
                User.create(user)
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
    else {
        res.status(403).json({ message: 'Mot de passe trop faible ! 8 caractères, dont un nombre, un caractère spécial, une minuscule et une majuscule.' })
    }

};


// connexion au site
exports.login = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user.id },
                            'cUWt#2CCQr%00B]uPDXiR|$N:p7J`F',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.delete = (req, res, next) => {
    User.destroy({ where: { id: req.params.id } })
        .then(user => {
            if (!user) {
                res.status(400).json({ message: 'Utilisateur inexistant !' })
            }
            else {
                res.status(200).json({ message: 'Utilisateur supprimé !' })
            }
        })
        .catch(error => res.status(500).json({ error }));
};


exports.modify = (req, res, next) => {
    User.update(
        { firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, email: req.body.email },
        { where: { id: req.params.id } })
        .then(result => {
            if (result[0]>0){
                res.status(200).json({ message: 'Utilisateur modifié !' })
            } else{
                res.status(400).json({ message: 'Utilisateur inexistant !' })
            }
        })
        .catch(error => res.status(400).json({ error }));
};


exports.getAllUsers = (req, res, next) => {
    User.findAll({ attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
        .then(users => {
            if (!users) {
                res.status(400).json({ message: 'Utilisateur inexistant !' })
            } else {
                res.status(200).json(users);
            }
        })
        .catch(error => res.status(500).json({ error }))
};


exports.getOneUser = (req, res, next) => {
    User.findOne({ 
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } , 
        where: { id: req.params.id } })
        .then(user => {
            if (!user) {
                res.status(400).json({ message: 'Utilisateur inexistant !' })
            } else {
                res.status(200).json(user);
            }
        })
        .catch(error => res.status(500).json({ error }))
};