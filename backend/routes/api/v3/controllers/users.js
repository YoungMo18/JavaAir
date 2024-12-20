import express from 'express';
const router = express.Router();

router.get('/myIdentity', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({
            status: "loggedin",
            userInfo: {
                name: req.session.account.name,
                username: req.session.account.username
            }
        });
    } else {
        res.json({ status: "loggedout" });
    }
});

router.get('/info', async (req, res) => {
    try {
        const { user } = req.query;
        if (!user) {
            return res.status(400).json({ status: "error", error: "Missing username" });
        }
        const userInfo = await req.models.UserInfo.findOne({ username: user });
        if (!userInfo) {
            return res.json({
                username: user,
                email: user,
                personalWebsite: "",
            });
        }
        console.log(userInfo)
        res.json(userInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.post('/info', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "Not logged in" });
        }
        const { personalWebsite } = req.body;
        if (!personalWebsite) {
            return res.status(400).json({ status: "error", error: "Missing personalWebsite" });
        }
        const username = req.session.account.username;
        let userInfo = await req.models.UserInfo.findOne({ username });
        if (!userInfo) {
            userInfo = new req.models.UserInfo({
                username,
                email: req.session.account.email,
                personalWebsite,
            });
        } else {
            userInfo.personalWebsite = personalWebsite;
        }
        await userInfo.save();
        res.json({ status: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

export default router;