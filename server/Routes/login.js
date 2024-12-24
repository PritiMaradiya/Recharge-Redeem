const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Model/User');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("Plain-text password:", password);
        console.log("Hashed password from DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password match:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, message: 'Login successful' });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


async function hello(username, email, password) {
    if (!username || !email || !password) {
        console.log('All fields are required');
        return;
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already in use');
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Explicit salt rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Password to be hashed:", password);
        console.log("Hashed password:", hashedPassword);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        console.log('User registered successfully');
    } catch (err) {
        console.error('Error in registration:', err);
    }
}
//hello("John","John@gmail.com","John@1234")
module.exports = router;
