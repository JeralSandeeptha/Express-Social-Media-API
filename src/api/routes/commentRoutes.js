const express = require('express');

const { createComment, getAllComment, getComment, deleteComment, updateComment } = require('../controllers/commentController');

const router = express.Router();

router.post('/', createComment);
router.get('/', getAllComment);
router.get('/:commentId', getComment);
router.delete('/:commentId', deleteComment);
router.put('/:commentId', updateComment);

module.exports = router;