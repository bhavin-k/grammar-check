const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    console.log("Registering user:", { username, email });
    
    if (!username || !password || !email) {
        return res.status(400).send('Username, password, and email are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    
    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        console.error('Error registering user:', error); 
        res.status(400).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;
    console.log("Login attempt for user:", { identifier });

    const user = identifier.includes('@') 
        ? await User.findOne({ email: identifier }) 
        : await User.findOne({ username: identifier });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Login successful for user:", { username: user.username });
        console.log("Generated token:", token); 
        res.json({ token, username: user.username });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

router.post('/logout', (req, res) => {
    res.send('Logged out');
});

module.exports = router;
