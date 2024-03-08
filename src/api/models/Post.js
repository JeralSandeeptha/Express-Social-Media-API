const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    comments: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);