const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const Like = db.likes;

const Op = db.Sequelize.Op;

require("dotenv").config();

exports.addPost = (req, res, next) => {
  // ajouter un post
  const post = { ...req.body };
  if (post.description.trim() == "") {
    res.status(400).json({ message: "manque description !" });
    return;
  }
  if (post.title.trim() == "") {
    res.status(400).json({ message: "manque titre!" });
    return;
  }
  if (req.file) {
    post.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  Post.create(post)
    .then((result) =>
      res.status(201).json({ message: "Post créé !", result: result })
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.addComment = (req, res, next) => {
  // ajouter un commentaire
  let comment = req.body;
  Comment.create(comment)
    .then((result) =>
      res.status(201).json({ message: "Commentaire créé !", result: result })
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.addLike = (req, res, next) => {
  // ajouter un like
  let like = req.body;
  console.log(like);
  Like.create(like)
    .then(() => res.status(201).json({ message: "Like ajouté !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteComment = (req, res, next) => {
  // supprimer un commentaire
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const admin = decodedToken.admin;
  const userId = decodedToken.userId;
  let request;
  if (admin) {
    request = { where: { id: req.body.id } };
  } else {
    request = { where: { id: req.body.id, userId: userId } };
  }
  Comment.destroy(request)
    .then((comment) => {
      if (!comment) {
        res.status(400).json({ message: "commentaire inexistant !" });
      } else {
        res.status(200).json({ message: "commentaire supprimé !" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.removeLike = (req, res, next) => {
  // supprimer un like
  Like.destroy({ where: { postId: req.body.postId, userId: req.body.userId } })
    .then((like) => {
      if (!like) {
        res.status(400).json({ message: "Like inexistant !" });
      } else {
        res.status(200).json({ message: "Like supprimé !" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
  //récupération de tous les posts
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const userId = decodedToken.userId;
  const admin = decodedToken.admin;
  Post.findAll({
    attributes: {
      include: [
        [
          // compte nb commentaires
          db.sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM comments
                            WHERE
                            comments.postId = post.id
                        )`),
          "nbComments",
        ],
        [
          // compte nb likes
          db.sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM likes
                            WHERE
                            likes.postId = post.id
                        )`),
          "nbLikes",
        ],
        [
          // est liké par l'utilisateur
          db.sequelize.literal(`(
                              SELECT TRUE
                              FROM likes
                              WHERE
                              likes.postId = post.id AND likes.userId=${userId}
                          )`),
          "liked",
        ],

        [
          // prénom de l'auteur
          db.sequelize.literal(`(
                            SELECT firstname
                            FROM users
                            WHERE
                            users.id = userId
                        )`),
          "firstname",
        ],
        [
          // nom de l'auteur
          db.sequelize.literal(`(
                            SELECT lastname
                            FROM users
                            WHERE
                            users.id = userId
                        )`),
          "lastname",
        ],
      ],
    },
    order: [["updatedAt", "DESC"]],
  })
    .then((posts) => {
      if (!posts) {
        res.status(400).json({ message: "post inexistant !" });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  // récupération d'un post
  Post.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Comment,
        include: [{ model: User, attributes: ["firstname", "lastname"] }],
      },
      { model: User, attributes: ["firstname", "lastname"] },
    ],
  })
    .then((post) => {
      if (!post) {
        res.status(400).json({ message: "post inexistant !" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deletePost = (req, res, next) => {// suppression d'un post
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const admin = decodedToken.admin;
  const userId = decodedToken.userId;
  let request;
  if (admin) {
    request = { where: { id: req.body.id } };
  } else {
    request = { where: { id: req.body.id, userId: userId } };
  }
  Post.findOne({ where: { id: req.body.id } })
    .then((post) => {
      if (post.dataValues.imageUrl != null) {
        // si il y a une image
        const filename = post.dataValues.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Post.destroy(request)
            .then((response) => {
              if (!response) {
                res.status(400).json({ message: "Post inexistant !" });
              } else {
                res.status(200).json({ message: "Post supprimé !" });
              }
            })
            .catch((error) => res.status(500).json({ error }));
        });
      } else {
        // s'il n'y a pas d'image
        Post.destroy(request)
          .then((response) => {
            if (!response) {
              res.status(400).json({ message: "Post inexistant !" });
            } else {
              res.status(200).json({ message: "Post supprimé !" });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneComment = (req, res, next) => {// récupération d'un commentaire
  console.log("get one comment");
  Comment.findOne({
    where: { id: req.params.commentId },
  })
    .then((post) => {
      if (!post) {
        res.status(400).json({ message: "post inexistant !" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
