const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("error", info?.message || "Incorrect credentials.");
        return res.redirect("/sessions/logon");
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);

        req.session.save((saveErr) => {
          if (saveErr) return next(saveErr);
          res.redirect("/");
        });
      });
    })(req, res, next);
  });

router.route("/logoff").post(logoff);

module.exports = router;
