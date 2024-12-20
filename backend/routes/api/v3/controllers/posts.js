import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "not logged in" });
        }
        const { url, description } = req.body;
        if (!url || !description) {
            return res.status(400).json({ status: "error", error: "Missing url or description" });
        }
        const newPost = new req.models.Post({
            url: url,
            description: description,
            username: req.session.account.username,
            created_date: new Date()
        });
        await newPost.save();
        res.json({ status: "success" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        // const username = req.query.username
        //     ? req.query.username
        //     : req.session.isAuthenticated
        //     ? req.session.account.username
        //     : null;

        const username = req.query.username;

        const filter = username ? { username: username } : {};
        console.log("Username:", username)

        const userPosts = await req.models.Post.find(filter);

        const postData = await Promise.all(
            userPosts.map(async post => {
                try {
                    const htmlPreview = await getURLPreview(post.url);
                    return {
                        id: post._id,
                        username: post.username,
                        url: post.url,
                        description: post.description,
                        likes: post.likes,
                        created_date: post.created_date,
                        htmlPreview: htmlPreview
                    };
                } catch (error) {
                    return {
                        id: post._id,
                        username: post.username,
                        url: post.url,
                        description: post.description,
                        likes: post.likes,
                        created_date: post.created_date,
                        htmlPreview: `Error generating preview: ${error.message}`
                    };
                }
            })
        );

        res.json(postData);

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.post('/like', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "not logged in" });
        }

        const { postID } = req.body;

        if (!postID) {
            return res.status(400).json({ status: "error", error: "Missing postID" });
        }

        const post = await req.models.Post.findById(postID);

        if (!post) {
            return res.status(404).json({ status: "error", error: "Post not found" });
        }

        const username = req.session.account.username;

        if (!post.likes.includes(username)) {
            post.likes.push(username);
        }

        await post.save();
        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.post('/unlike', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "not logged in" });
        }

        const { postID } = req.body;

        if (!postID) {
            return res.status(400).json({ status: "error", error: "Missing postID" });
        }

        const post = await req.models.Post.findById(postID);

        if (!post) {
            return res.status(404).json({ status: "error", error: "Post not found" });
        }

        const username = req.session.account.username;

        if (post.likes.includes(username)) {
            // side note to future self: there's no built-in remove(object) for arrays in javascript, so i'm using filter instead
            post.likes = post.likes.filter(user => user !== username);
        }

        await post.save();
        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.delete("/", async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "not logged in" });
        }

        const { postID } = req.body;

        if (!postID) {
            return res.status(400).json({ status: "error", error: "Missing postID" });
        }

        const post = await req.models.Post.findById(postID);

        if (!post) {
            return res.status(404).json({ status: "error", error: "Post not found" });
        }

        const username = req.session.account.username;

        if (post.username !== username) {
            return res.status(401).json({
                status: "error",
                error: "you can only delete your own posts"
            });
        }

        await req.models.Comment.deleteMany({ post: postID });

        await req.models.Post.deleteOne({ _id: postID });

        res.json({ status: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

export default router;