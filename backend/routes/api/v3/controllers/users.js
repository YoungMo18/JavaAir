import express from 'express';
const router = express.Router();
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';

// Route to fetch user session information
router.get('/myIdentity', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({
            status: "loggedin",
            userInfo: {
                username: req.session.user.username, // Updated to use `req.session.user`
                userType: req.session.user.userType, // Updated to use `req.session.user`
            },
        });
    } else {
        res.json({ status: "loggedout" });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { username, password, userType } = req.body;

    if (!username || !password || !userType) {
        return res.status(400).json({ status: 'error', message: 'Missing fields' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new req.models.User({
            username,
            password: hashedPassword,
            userType,
        });
        await newUser.save();
        res.status(201).json({ status: 'success', message: 'User created' });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: 'error', message: 'Missing fields' });
    }

    try {
        const user = await req.models.User.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const passwordMatch = await verifyPassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Set session details
        req.session.isAuthenticated = true;
        req.session.user = {
            id: user._id,
            username: user.username,
            userType: user.userType
        };

        res.status(200).json({ status: 'success', message: 'Login successful' });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.status(500).json({ status: "error", error: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        res.json({ status: "success", message: "Logged out successfully" });
    });
});

export default router;
