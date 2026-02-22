const User = require("../../models/user");
const parseError = require("../utils/parseValidationErrs");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  if (req.body.password !== req.body.password1) {
    req.flash("error", "Passwords do not match.");
    return res.render("register", { errors: req.flash("error") });
  }
  try {
    await User.create(req.body);
  } catch (err) {
    if (err.constructor.name === "ValidationError") {
      parseError(err, req);
    } else if (err.name === "MongoServerError" && err.code === 11000) {
      req.flash("error", "That username is already taken.");
    } else {
      return next(err);
    }
    return res.render("register", { errors: req.flash("error") });
  }
  res.redirect("/sessions/logon");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
