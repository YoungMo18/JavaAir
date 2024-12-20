import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get('/preview', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const previewHtml = await getURLPreview(url);
    res.type('html');
    res.send(previewHtml);
  } catch (err) {
    res.status(500).send(`<p>Error fetching the preview: ${err.message}</p>`);
  }
});

export default router;