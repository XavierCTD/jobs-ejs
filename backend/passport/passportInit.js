const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

const passportInit = () => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, next) => {
        try {
          const normalUsername = String(username).trim().toLowerCase();
          const user = await User.findOne({ username: normalUsername });
          if (!user) {
            return next(null, false, { message: "Incorrect credentials." });
          }

          const result = await user.comparePassword(password);
          if (result) {
            return next(null, user);
          } else {
            return next(null, false, { message: "Incorrect credentials." });
          }
        } catch (e) {
          return next(e);
        }
      },
    ),
  );

  passport.serializeUser(async function (user, next) {
    next(null, user.id);
  });

  passport.deserializeUser(async function (id, next) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return next(new Error("User not found"));
      }
      next(null, user);
    } catch (e) {
      next(e);
    }
  });
};

module.exports = passportInit;
