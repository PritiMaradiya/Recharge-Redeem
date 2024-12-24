const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Optional role field
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
