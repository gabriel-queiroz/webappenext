module.exports = (req, res, next) => {
  if (req.method === "POST" && req.path === "/welcome") {
    res.setHeader("Content-Type", "text/markdown");
    const markdownContent = `
# Welcome to Markdown API

This is a **sample** Markdown content.

* Bullet point 1
* Bullet point 2
* Bullet point 3
    `;
    res.status(200).send(markdownContent);
  } else {
    next();
  }
};
