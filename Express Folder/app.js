require("dotenv").config(); // load .env variables

const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const MongoDBStore = require("connect-mongodb-session")(session);
const connectDB = require("./database/connect");
const storeLocals = require("./middleware/storeLocals");
const auth = require("./middleware/auth");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", (err) => {
  console.log(err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: { secure: false, sameSite: "lax", httpOnly: true },
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

// API routes

app.use("/sessions", require("./routes/sessionRoutes"));

const secretWordRouter = require("./routes/secretWord");
const { Http2ServerRequest } = require("http2");
app.use("/secretWord", auth, secretWordRouter);

const reactDistPath = path.join(__dirname, "..", "React Folder", "dist");
app.use(express.static(reactDistPath, { index: false }));

const sendReactPath = (res) => {
  res.sendFile(path.join(reactDistPath, "index.html"));
};

app.get("/", auth, (req, res) => sendReactPath(res));
app.get("/about", auth, (req, res) => sendReactPath(res));
app.get(/^\/app(\/.*)?$/, auth, (req, res) => sendReactPath(res));

// Error handling middleware

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) does not exist!`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
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
