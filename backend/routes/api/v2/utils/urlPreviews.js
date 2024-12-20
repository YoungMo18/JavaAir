import fetch from 'node-fetch';
import parser from 'node-html-parser';

const escapeHTML = str => String(str).replace(/[&<>'"]/g,
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag])
);

async function getURLPreview(url) {
  let preview = "";

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

    for (let i = 0; i < metaTags.length; i++) {
      const property = metaTags[i].getAttribute("property");
      const content = metaTags[i].getAttribute("content");
      if (property && metadata.hasOwnProperty(property)) {
        metadata[property] = content;
      }
    }

    if (metadata["og:title"] === url) {
      const titleTag = htmlPage.querySelector("title");
      metadata["og:title"] = titleTag ? titleTag.textContent.trim() : url;
    }

    preview = `
      <div style="max-width: 300px; border: solid 1px; border-radius: 5px; padding: 3px; text-align: center;">
          <a href="${escapeHTML(metadata["og:url"])}">
              <p><strong>${escapeHTML(metadata["og:title"])}</strong></p>
              ${
                metadata["og:image"]
                  ? `<img src="${escapeHTML(metadata["og:image"])}" style="max-height: 200px; max-width: 270px;">`
                  : ""
              }
          </a>
          ${
            metadata["og:description"]
              ? `<p>${escapeHTML(metadata["og:description"])}</p>`
              : ""
          }
          ${
            metadata["og:site_name"]
              ? `<p>Site name: ${escapeHTML(metadata["og:site_name"])}</p>`
              : ""
          }
          <p>Type: ${escapeHTML(metadata["og:type"])}</p>
      </div>
    `;
  } catch (err) {
    preview = `
      <div style="max-width: 300px; border: solid 1px; padding: 3px; text-align: center; color: red;">
          <p><strong>Error:</strong> Unable to fetch or parse the URL.</p>
          <p>${err.message}</p>
      </div>
    `;
  }

  return preview;
}

export default getURLPreview;