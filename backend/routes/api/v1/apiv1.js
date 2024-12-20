import express from "express";
import parser from "node-html-parser";
import fetch from "node-fetch";
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/urls/preview", async (req, res, next) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("Missing url parameter");
  }
  try {
    const response = await fetch(url);
    const pageText = await response.text();
    const htmlPage = parser.parse(pageText);
    const metadata = {
      "og:title": url,
      "og:type": "website",
      "og:image": "",
      "og:url": url,
      "og:description": "",
      "og:site_name": "",
    };
    const metaTags = htmlPage.querySelectorAll("meta");
    console.log(metaTags.length);
    for (let i = 0; i < metaTags.length; i++) {
      const property = metaTags[i].getAttribute("property");
      const content = metaTags[i].getAttribute("content");
      if (property && property in metadata) {
        metadata[property] = content;
      }
    }
    if (metadata["og:title"] === url) {
      const titleTag = htmlPage.querySelector("title");
      metadata["og:title"] = titleTag ? titleTag.textContent.trim() : url;
    }
    const previewHtml = `
      <div style="max-width: 300px; border: solid 1px; border-radius: 5px; padding: 3px; text-align: center;">
          <a href="${metadata["og:url"]}">
              <p><strong>${metadata["og:title"]}</strong></p>
              ${
                metadata["og:image"]
                  ? `<img src="${metadata["og:image"]}" style="max-height: 200px; max-width: 270px;">`
                  : ""
              }
          </a>
          ${
            metadata["og:description"]
              ? `<p>${metadata["og:description"]}</p>`
              : ""
          }
          ${
            metadata["og:site_name"]
              ? `<p>Site name: ${metadata["og:site_name"]}</p>`
              : ""
          }
          <p>Type: ${metadata["og:type"]}</p>
      </div>
  `;
    res.type("html");
    res.send(previewHtml);
  } catch (err) {
    const errorHtml = `
      <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center; color: red;">
          <p><strong>Error:</strong> Unable to fetch or parse the URL.</p>
          <p>${err.message}</p>
      </div>
    `;
    res.status(500).type("html").send(errorHtml);
  }
});

export default router;
