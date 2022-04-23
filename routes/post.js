const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');

router.post('/', auth,  multer,  postCtrl.addPost);
router.post('/comment',auth, postCtrl.addComment)
router.post('/like',auth,  postCtrl.addLike)
router.delete("/", auth, postCtrl.deletePost);
router.delete("/like",  auth, postCtrl.removeLike);
router.delete("/comment",  auth, postCtrl.deleteComment);
router.get('/', auth,  postCtrl.getAllPosts)
router.get('/:id',auth, postCtrl.getOnePost)

module.exports = router;