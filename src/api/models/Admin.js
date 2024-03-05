const mongoose = require('mongoose');

const AdminModel = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminModel);