const express = require('express');
const {
    createPost,
    deletePost,
    dislikePost,
    getAllPosts,
    getPost,
    likePost,
    updatePost
} = require('../controllers/postController');

const router = express.Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:postId', getPost);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.put('/dislike/:postId', dislikePost);
router.put('/like/:postId', likePost);

module.exports = router;