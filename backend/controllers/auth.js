const passport = require("passport");
const User = require("../models/user");

const register = async (req, res, next) => {
  const { username, password, password1 } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }
  if (password1 && password !== password1) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const user = await User.create({ username, password });
    return res.status(201).json({ username: user.username });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
      return res.status(400).json({ error: message });
    }
    if (err.code && err.code === 11000) {
      return res.status(400).json({ error: "Username already exists." });
    }
    return next(err);
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Incorrect credentials." });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.status(200).json({ username: user.username });
      });
    });
  })(req, res, next);
};

module.exports = { login, register };
