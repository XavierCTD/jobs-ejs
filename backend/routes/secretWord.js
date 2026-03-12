const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.json({
    secretWord: req.session.secretWord,
  });
});

router.post("/", (req, res) => {
  const word = (req.body.secretWord || "").trim();

  if (!word) {
    return res.status(400).json({ error: "Secret word is required." });
  }

  if (word.toUpperCase().startsWith("P")) {
    return res
      .status(400)
      .json({ error: "You can't use words that start with p." });
  }

  req.session.secretWord = word;
  return res.json({
    info: "The secret word was changed.",
    secretWord: req.session.secretWord,
  });
});

module.exports = router;
