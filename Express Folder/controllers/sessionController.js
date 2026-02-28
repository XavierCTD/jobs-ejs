const User = require("../models/user");
const parseError = require("../utils/parseValidationErrs");

const renderAuthPage = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; }
    form { display: grid; gap: .75rem; max-width: 300px; margin: auto; }
    input, button { padding: .5rem; }
    .msg { margin: .5rem 0; color: red; }
    .ok { color: green; }
    a { margin-right: .75rem;}
  </style>
</head>
<body>
  ${body}
</body>
</html>`;

const registerShow = (req, res) => {
  const errors = req.flash("error");
  const errorHtml = errors
    .map((err) => `<div class="msg">${err}</div>`)
    .join("");

  res.send(
    renderAuthPage(
      "Register",
      `
    <h1>Register</h1>
    ${errorHtml}
    <form action="/sessions/register" method="POST">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="password" name="password1" placeholder="Confirm Password" required />
      <button type="submit">Register</button>
    </form>
    <p><a href="/sessions/logon">Log On</a></p>
  `,
    ),
  );
};

const registerDo = async (req, res, next) => {
  if (req.body.password !== req.body.password1) {
    req.flash("error", "Passwords do not match.");
    return res.redirect("/sessions/register");
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
    return res.redirect("/sessions/register");
  }
  req.flash("status", "Registration successful. Please log on.");
  res.redirect("/sessions/logon");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) console.log(err);
    res.clearCookie("connect.sid");
    return res.redirect("/sessions/logon");
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    setTimeout(() => {
      logonShow.innerHTML = "Logged In.";
    }, 1000);
    return res.redirect("/");
  }

  const errors = req.flash("error");
  const infos = req.flash("status");
  const errorHtml = errors
    .map((err) => `<div class="msg">${err}</div>`)
    .join("");
  const infoHtml = infos
    .map((info) => `<div class="msg ok">${info}</div>`)
    .join("");
  res.send(
    renderAuthPage(
      "Log In",
      `
    <h1>Log In</h1>
    ${errorHtml}
    ${infoHtml}
    <form action="/sessions/logon" method="POST">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Log On</button>
    </form>
    <p><a href="/sessions/register">Register</a></p>
    `,
    ),
  );
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
