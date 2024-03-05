const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminModel = require('../models/Admin');
const logger = require('../../utils/logger');
const SuccessResponse = require('../../utils/SuccessResponse');
const ErrorResponse = require('../../utils/ErrorResponse');

const findByUsername = async (username) => {
    try {
        const admin = await AdminModel.find({ username: username });

        if(admin) {
            return true;
            logger.info("Admin is already exists");
        }else {
            return false;
            logger.info("Admin is not exists");
        }
    } catch (error) {
        logger.error("Admin is exists query was internal server error");
    }
}
const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await findByUsername(username);
        if(admin) {
            logger.info("Admin is already exists");
        }else {
            try {
                const salt = await  bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);

                const newUser = new AdminModel({
                    username: username,
                    password: hashPassword,
                });

                const user = await newUser.save();

                logger.info("Admin register query was successful");
                res.status(201).json(
                    new SuccessResponse(
                        201,
                        "Admin register query was successful",
                        user
                    )
                );
            } catch (error) {
                logger.error("Admin register query was failed");
                logger.error(error.message);
                res.status(500).json(
                    new ErrorResponse(
                        500,
                        "Admin register query was failed",
                        error.message
                    )
                );
            }
        }
    } catch (error) {
        logger.error("Admin register query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Admin register query was internal server error",
                error.message
            )
        );
    }
}
const loginAdmin = async (req, res) => {
    try {
        const admin = await AdminModel.findOne({ email: req.body.username });
        if (!admin){ 
            logger.error("Username not found"); 
            return res.status(404).json(
                new ErrorResponse(
                    400,
                    "Admin login query was failed",
                    "Username not found"
                )
            );
        }
        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword){
            return res.status(400).json(
                new ErrorResponse(
                    400,
                    "Admin login query was failed",
                    "Password not found"
                )
            );
        }

        const { password, ...others } = user._doc;

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'privateKey');

        return res.status(200).json(
            new SuccessResponse(
                200,
                "Admin login query was successful",
                {
                    ...others,
                    token
                }
            )
        ); 

    } catch (error) {
        logger.error("Admin login query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Admin login query was internal server error",
                error.message
            )
        );
    }
}
const getAdmin = async (req, res) => {
    try {
        const admin = await AdminModel.findById(req.params.adminId);
        if (admin) {
            logger.info("Get admin query was successful");
            return new SuccessResponse(
                200,
                "Get admin query was successful",
                admin
            ) 
        }else {
            logger.info("Get admin query was failed");
            return new ErrorResponse(
                200,
                "Get admin query was faild",
                "Admin id not found"
            ) 
        }
    } catch (error) {
        logger.error("Get admin query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get admin query was internal server error",
                error.message
            )
        );
    }
}
const getAllAdmins = async (req, res) => {
    try {
        const admins = await AdminModel.find();
        return new SuccessResponse(
            200,
            "Get all admins query was successful",
            admins
        ) 
    } catch (error) {
        logger.error("Get all admins query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Get all admins query was internal server error",
                error.message
            )
        );
    }
}
const updateAdmin = async (req, res) => {
    try {
        const admin = await AdminModel.findById(req.params.adminId);
        if (admin) {
            const updatedAdmin = await AdminModel.findByIdAndUpdate(req.params.adminId, { $set: req.body }, { new: true });
            logger.info("Update admin query was successful");
            return new SuccessResponse(
                200,
                "Update admin query was successful",
                updatedAdmin
            ) 
        }else {
            logger.info("Update admin query was failed");
            return new ErrorResponse(
                200,
                "Update admin query was faild",
                "Admin id not found"
            ) 
        }
    } catch (error) {
        logger.error("Update admin query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Update admin query was internal server error",
                error.message
            )
        );
    }
}
const deleteAdmin = async (req, res) => {
    try {
        const admin = await AdminModel.findById(req.params.adminId);
        if (admin) {
            await AdminModel.findByIdAndDelete(req.params.adminId);
            logger.info("Delete admin query was successful");
            return new SuccessResponse(
                200,
                "Delete admin query was successful",
            ) 
        }else {
            logger.info("Delete admin query was failed");
            return new ErrorResponse(
                200,
                "Get admin query was faild",
                "Admin id not found"
            ) 
        }
    } catch (error) {
        logger.error("Delete admin query was internal server error");
        logger.error(error.message);
        return res.status(500).json(
            new ErrorResponse(
                500,
                "Delete admin query was internal server error",
                error.message
            )
        );
    }
}

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
};