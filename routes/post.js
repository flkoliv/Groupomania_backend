const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');

router.post('/', postCtrl.addPost);
router.post('/:id', postCtrl.addComment)
router.post('/:id/like', postCtrl.addLike)
router.get('/', postCtrl.getAllPosts)




module.exports = router;