require("dotenv").config(); // load .env variables

const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const MongoDBStore = require("connect-mongodb-session")(session);
const connectDB = require("./Express Folder/database/connect");
const storeLocals = require("./Express Folder/middleware/storeLocals");
const auth = require("./Express Folder/middleware/auth");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", (err) => {
  console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Express Folder", "views"));
app.use(express.urlencoded({ extended: true }));

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true; // serve secure cookies in production
}

app.use(session(sessionParms));
passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(require("connect-flash")());
app.use(storeLocals);

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./Express Folder/routes/sessionRoutes"));

// secret word handling

// let secretWord = "syzygy";
const secretWordRouter = require("./Express Folder/routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);

const reactDistPath = path.join(__dirname, "React Folder", "dist");
const reactIndexPath = path.join(reactDistPath, "index.html");

if (fs.existsSync(reactIndexPath)) {
  app.use("/assets", express.static(path.join(reactDistPath, "assets")));
  app.get(/^\/app(\/.*)?$/, auth, (req, res) => {
    res.sendFile(reactIndexPath);
  });
} else {
  app.get("/app", auth, (req, res) => {
    res.status(503).send("React app is not built yet. Run `npm run build`.");
  });
}

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) does not exist!`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (err) {
    console.log(err);
  }
};

start();
