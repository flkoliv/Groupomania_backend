const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;

const Op = db.Sequelize.Op;

exports.addPost = (req, res, next) => {
    console.log("add post")
    Post.create(req.body)
        .then(() => res.status(201).json({ message: 'Post créé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.addComment = (req, res, next) => {

};

exports.addLike = (req, res, next) => {

};

exports.getAllPosts = (req, res, next) => {
    Post.findAll()
        .then(posts => {
            if (!posts) {
                res.status(400).json({ message: 'post inexistant !' })
            } else {
                res.status(200).json(posts);
            }
        })
        .catch(error => res.status(500).json({ error }))
};

exports.getOnePost = (req, res, next) => {

};