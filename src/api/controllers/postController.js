const logger = require('../../utils/logger');
const ErrorResponse = require('../../utils/ErrorResponse');
const SuccessResponse = require('../../utils/SuccessResponse');

const PostSchema = require('../models/Post');

const createPost = async (req, res) => {
    try {
        const { title, description, user } = req.body;
        const newPost = new PostSchema({
            title: title,
            description: description,
            user: user
        });
        const savedPost = await newPost.save();
        logger.info("Create post internal server error");
        return res.status(201).json(
            new SuccessResponse(
                200,
                "Create post query was successful",
                savedPost
            )
        );
    } catch (error) {
        logger.error("Create post internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Create post internal server error",
                error.message
            )
        );
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await PostSchema.find();
        logger.info("Get all posts query was successful");
        return res.status(200).json(
            new SuccessResponse(
                200,
                "Get all posts query was successful",
                posts
            )
        );
    } catch (error) {
        logger.error("Get all posts internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get all posts internal server error",
                error.message
            )
        );
    }
}

const getPost = async (req, res) => {
    try {
        const post = await PostSchema.findById(req.params.postId).populate('user').exec();
        if (post) {
            return res.status(200).json(
                new SuccessResponse(
                    200,
                    "Get post query was successful",
                    post
                )
            );
        }else {
            return res.status(400).json(
                new ErrorResponse(
                    500,
                    "Get post internal server error",
                    "Post id not found"
                )
            );
        }
    } catch (error) {
        logger.error("Get post internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get post internal server error",
                error.message
            )
        );
    }
}

const updatePost = async (req, res) => {
    try {
        const post = await PostSchema.get(req.params.postId);
        if (post) {
            const updatedPost = await PostSchema.findByIdAndUpdate(
                req.params.postId,
                { $set: req.body },
                { new: true }
            );
            logger.info("Update post query was successful");
            return res.status(200).json(
                new SuccessResponse(
                    200,
                    "Get post query was successful",
                    updatedPost
                )
            );
        }else {
            return res.status(400).json(
                new ErrorResponse(
                    500,
                    "Update post query was failed",
                    "Post id not found"
                )
            );
        }
    } catch (error) {
        logger.error("Update post internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Update post internal server error",
                error.message
            )
        );
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await PostSchema.get(req.params.postId);
        if (post) {
            await PostSchema.delete(req.params.postId);
            logger.info("Delete post query was successful");
            return res.status(204).json(
                new SuccessResponse(
                    200,
                    "Delete post query was successful",
                )
            );
        }else {
            logger.info("Delete post query was failed");
            return res.status(400).json(
                new ErrorResponse(
                    500,
                    "Delete post query was failed",
                    "Post id not found"
                )
            );
        }
    } catch (error) {
        logger.error("Delete post internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Delete post internal server error",
                error.message
            )
        );
    }
}

const likePost = async (req, res) => {
    try {
        const updatedPost = await PostSchema.findByIdAndUpdate(
            req.params.postId,
            {
                $push: {
                    likes: req.body.userId
                }
            },
            { new: true }
        );
        logger.info("Like post query was successfull");
        return res.status(200).json(
            200,
            "Like post query was successfull",
            updatedPost
        );
    } catch (error) {
        logger.error("Like post internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Like post internal server error",
                error.message
            )
        );
    }
}

const dislikePost = async (req, res) => {
    try {
        const updatedPost = await PostSchema.findByIdAndUpdate(
            req.params.postId,
            {
                $pull: {
                    likes: req.body.userId
                }
            },
            { new: true }
        );
        logger.info("Dislike post query was successfull");
        return res.status(200).json(
            200,
            "Dislike post query was successfull",
            updatedPost
        );
    } catch (error) {
        logger.error("Dislike post internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Dislike post internal server error",
                error.message
            )
        );
    }
}

module.exports = {
    getPost,
    createPost,
    deletePost,
    dislikePost,
    getAllPosts,
    updatePost,
    likePost
}