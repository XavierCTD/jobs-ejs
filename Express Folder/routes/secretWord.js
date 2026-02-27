const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }

  const errors = req.flash("error");
  const infos = req.flash("info");
  const errorHtml = errors
    .map((err) => `<div class="msg">${err}</div>`)
    .join("");
  const infoHtml = infos
    .map((info) => `<div class="msg ok">${info}</div>`)
    .join("");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Secret Word</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2rem; }
        form { display: grid; gap: .75rem; max-width: 320px; }
        input, button { padding: .5rem; }
        a { margin-right: .75rem; }
      </style>
    </head>
    <body>
      <h1>Secret Word</h1>
      <p> Current: <strong>${req.session.secretWord}</strong></p>
      ${errorHtml}
      ${infoHtml}
      <form action="/secretWord" method="POST">
        <input type="text" name="secretWord" placeholder="Enter new secret word" required />
        <button type="submit">Change Secret Word</button>
      </form>
      <p><a href="/">Home</a><a href="/about">About</a></p>
    </body>
    </html>`);
});

router.post("/", (req, res) => {
  const word = (req.body.secretWord || "").trim();

  if (!word) {
    req.flash("error", "Secret word is required.");
  } else if (word.toUpperCase().startsWith("P")) {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that starts with p.");
  } else {
    req.session.secretWord = word;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
});

module.exports = router;
