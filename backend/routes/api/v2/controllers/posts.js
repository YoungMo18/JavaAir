import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post('/', async (req, res) => {
  try {
      const { url, description, username } = req.body;

      if (!url || !description || !username) {
          return res.status(400).json({ status: "error", error: "Missing url, description, or userame" });
      }

      const newPost = new req.models.Post({
          url: url,
          description: description,
          username: username,
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
      const allPosts = await req.models.Post.find();

      let postData = await Promise.all(
          allPosts.map(async post => {
              try {
                  const htmlPreview = await getURLPreview(post.url);
                  return {
                      username: post.username,
                      description: post.description,
                      htmlPreview: htmlPreview
                  };
              } catch (error) {
                  return {
                      username: username,
                      description: post.description,
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


export default router;