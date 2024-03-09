const CommentSchema = require('../models/Comment');
const PostSchema = require('../models/Post');
const logger = require('../../utils/logger');
const SuccessResponse = require('../../utils/SuccessResponse');
const ErrorResponse = require('../../utils/ErrorResponse');

const createComment = async (req, res) => {
    try {
        const { comment, userId, postId } = req.body;
        const newComment = new CommentSchema({
            comment: comment,
            userId: userId,
            postId: postId
        });
        const savedComment = await newComment.save();
        logger.info("Create comment query was successfully saved");
        const updatedPost = await PostSchema.findByIdAndUpdate(
            postId,
            { $push: { comments: savedComment._id } },
            { new : true}
        );
        logger.info("New comment added to post's comments list");
        return res.status(201).json(
            new SuccessResponse(
                201,
                "Create comment query was successfully",
                {
                    comment: savedComment,
                    updatedPost: updatedPost
                }
            )
        );
    } catch (error) {
        logger.error(error.message);
        logger.error("Create comment query internal server error");
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Create comment query internal server error",
                error.message
            )
        );
    }
}
const getAllComment = async (req, res) => {
    try {
        const comments = await CommentSchema.find();
        logger.info("Get all comments query was successfully");
        return res.status(200).json(
            new SuccessResponse(
                201,
                "Get all comments query was successfully",
                comments
            )
        );
    } catch (error) {
        logger.error(error.message);
        logger.error("Get all comments query internal server error");
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get all comments query internal server error",
                error.message
            )
        );
    }
}
const getComment = async (req, res) => {
    try {
        const comment = await CommentSchema.findById(req.params.commentId);
        if(!comment) {
            logger.error("Get comment query was failed");
            return res.status(404).json(
                new ErrorResponse(
                    404,
                    "Get comment query was failed",
                    `${req.params.commentId} comment id not found`
                )
            );
        }else {
            logger.info("Get comment query was successful");
            return res.status(200).json(
                new SuccessResponse(
                    201,
                    "Get comment query was successfully",
                    comment
                )
            );
        }
    } catch (error) {
        logger.error(error.message);
        logger.error("Get comment query internal server error");
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get comment query internal server error",
                error.message
            )
        );
    }
}
const updateComment = async (req, res) => {
    try {
        const comment = await CommentSchema.findById(req.params.commentId);
        if(!comment) {
            logger.error("Update comment query was failed");
            return res.status(404).json(
                new ErrorResponse(
                    404,
                    "Update comment query was failed",
                    `${req.params.commentId} comment id not found`
                )
            );
        }else {
            const updatedComment = await CommentSchema.findByIdAndUpdate(
                req.params.commentId,
                { $set: req.body },
                { new : true}
            ); 
            logger.info("Update comment query was successful");
            return res.status(200).json(
                new SuccessResponse(
                    201,
                    "Update comment query was successfully",
                    updatedComment
                )
            );
        }
    } catch (error) {
        logger.error(error.message);
        logger.error("Update comment query internal server error");
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Update comment query internal server error",
                error.message
            )
        );
    }
}
const deleteComment = async (req, res) => {
    try {
        const comment = await CommentSchema.findById(req.params.commentId);
        if(!comment) {
            logger.error("Delete comment query was failed");
            return res.status(404).json(
                new ErrorResponse(
                    404,
                    "Delete comment query was failed",
                    `${req.params.commentId} comment id not found`
                )
            );
        }else {
            await CommentSchema.findByIdAndDelete(req.params.commentId);
            logger.info("Delete comment query was successful");
            const updatedPost = await PostSchema.findByIdAndUpdate(
                postId,
                { $pull: { comments: req.params.commentId } },
                { new : true}
            );
            logger.info("Comment was removed from post's comments list");
            return res.status(200).json(
                new SuccessResponse(
                    200,
                    "Delete comment query was successfully",
                    "Comment deleted"
                )
            );
        }
    } catch (error) {
        logger.error(error.message);
        logger.error("Delete comment query internal server error");
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Delete comment query internal server error",
                error.message
            )
        );   
    }
}

module.exports = {
    createComment,
    getAllComment,
    getComment,
    updateComment,
    deleteComment
};