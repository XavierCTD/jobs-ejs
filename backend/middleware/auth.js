const authMiddleware = (req, res, next) => {
  if (!req.user) {
    const passJson =
      req.originalUrl.startsWith("/api/") ||
      req.originalUrl.startsWith("/secretWord") ||
      req.headers.accept?.includes("application/json");

    if (passJson) {
      return res.status(401).json({ error: "Authentication required." });
    }

    req.flash("error", "You can't access this page before logon.");
    return res.redirect("/sessions/logon");
  }

  next();
};

module.exports = authMiddleware;
