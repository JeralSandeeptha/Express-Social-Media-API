const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = require('../models/User');
const logger = require('../../utils/logger');
const SuccessResponse = require('../../utils/SuccessResponse');
const ErrorResponse = require('../../utils/ErrorResponse');

const findByUsername = async (username) => {
    try {
        const admin = await UserSchema.find({ username: username });

        if(admin) {
            logger.info("User is already exists");
            return true;
        }else {
            logger.info("User is not exists");
            return false;
        }
    } catch (error) {
        logger.error("User is exists query was internal server error");
    }
}

const registerUser = async (req, res) => {
    try {
        const { username, password, city } = req.body;
        const salt = await  bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new UserSchema({
            username: username,
            password: hashPassword,
            city: city,
        });

        const user = await newUser.save();

        logger.info("User register query was successful");
        return res.status(201).json(
            new SuccessResponse(
                201,
                "User register query was successful",
                user
            )
        );
    } catch (error) {
        logger.error("User register query was failed");
        logger.error(error.message);
        res.status(500).json(
            new ErrorResponse(
                500,
                "User register query was failed",
                error.message
            )
        );
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await UserSchema.findOne({ username: req.body.username });
        if (!user){ 
            logger.error("Username not found"); 
            return res.status(404).json(
                new ErrorResponse(
                    400,
                    "User login query was failed",
                    "Username not found"
                )
            );
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword){
            return res.status(400).json(
                new ErrorResponse(
                    400,
                    "User login query was failed",
                    "Password not found"
                )
            );
        }

        const { password, ...others } = user._doc;

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'privateKey');

        return res.status(200).json(
            new SuccessResponse(
                200,
                "User login query was successful",
                {
                    ...others,
                    token
                }
            )
        ); 

    } catch (error) {
        logger.error("User login query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "User login query was internal server error",
                error.message
            )
        );
    }
}

const getUser = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.params.userId);
        if (user) {
            logger.info("Get user query was successful");
            return res.status(200).json(
                new SuccessResponse(
                    200,
                    "Get user query was successful",
                    user
                ) 
            );
        }else {
            logger.info("Get user query was failed");
            return new ErrorResponse(
                200,
                "Get user query was faild",
                "User id not found"
            ) 
        }
    } catch (error) {
        logger.error("Get user query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get user query was internal server error",
                error.message
            )
        );
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await UserSchema.find();
        return res.status(200).json(
            new SuccessResponse(
                200,
                "Get users admins query was successful",
                users
            ) 
        );
    } catch (error) {
        logger.error("Get all users query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get all users query was internal server error",
                error.message
            )
        );
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.params.userId);
        if (user) {
            const updatedUser = await UserSchema.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
            logger.info("Update user query was successful");
            return res.status(200).json(
                new SuccessResponse(
                    200,
                    "Update user query was successful",
                    updatedUser
                ) 
            );
        }else {
            logger.info("Update user query was failed");
            return res.status(400).json(
                new ErrorResponse(
                    400,
                    "Update user query was faild",
                    "User id not found"
                ) 
            );
        }
    } catch (error) {
        logger.error("Update user query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Update user query was internal server error",
                error.message
            )
        );
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.params.userId);
        if (user) {
            await UserSchema.findByIdAndDelete(req.params.userId);
            logger.info("Delete user query was successful");
            return res.status(204).json(
                new SuccessResponse(
                    200,
                    "Delete user query was successful",
                ) 
            );
        }else {
            logger.info("Delete user query was failed");
            return res.status(400).json(
                new ErrorResponse(
                    200,
                    "Get user query was faild",
                    "User id not found"
                ) 
            );
        }
    } catch (error) {
        logger.error("Delete user query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Delete user query was internal server error",
                error.message
            )
        );
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
};