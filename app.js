require("dotenv").config(); // load .env variables first

const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", (err) => {
  console.log(err);
});

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

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
app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

// secret word handling

// let secretWord = "syzygy";
const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");
app.use("/secretWord", auth, secretWordRouter);

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
    await require("./database/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (err) {
    console.log(err);
  }
};

start();
