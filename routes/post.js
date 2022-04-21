const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');

router.post('/', multer,  postCtrl.addPost);
router.post('/comment', postCtrl.addComment)
router.post('/like',  postCtrl.addLike)
router.put("/:id", auth, postCtrl.updatePost);
router.delete("/", auth, postCtrl.deletePost);
router.delete("/like",  postCtrl.removeLike);
router.delete("/comment",  postCtrl.deleteComment);
router.get('/',   postCtrl.getAllPosts)
router.get('/:id', postCtrl.getOnePost)
router.get('/:id/like',  postCtrl.getAllLikes )





module.exports = router;