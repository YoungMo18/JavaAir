import express from 'express';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
      const { postID } = req.query;

      if (!postID) {
          return res.status(400).json({ status: "error", error: "Missing postID" });
      }

      const comments = await req.models.Comment.find({ post: postID });

      res.json(comments);
  } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
      if (!req.session.isAuthenticated) {
          return res.status(401).json({ status: "error", error: "not logged in" });
      }

      const { postID, newComment } = req.body;

      if (!postID || !newComment) {
          return res.status(400).json({ status: "error", error: "Missing postID or newComment" });
      }

      const username = req.session.account.username;

      const comment = new req.models.Comment({
          username: username,
          comment: newComment,
          post: postID,
          created_date: new Date()
      });

      await comment.save();

      res.json({ status: "success" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;