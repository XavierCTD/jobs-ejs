require("dotenv").config(); // load .env variables

const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const MongoDBStore = require("connect-mongodb-session")(session);
const connectDB = require("./database/connect");
const storeLocals = require("./middleware/storeLocals");
const auth = require("./middleware/auth");

// extra security packages

const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

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

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/errorhandler");

app.use(express.json());
app.use(helmet());
app.use(cors());
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

// API routes

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/sessions", require("./routes/sessionRoutes"));

const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);
app.use("/api/notes", auth, require("./routes/noteRoutes"));

const reactDistPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(reactDistPath, { index: false }));

const sendReactPath = (res) => {
  res.sendFile(path.join(reactDistPath, "index.html"));
};

app.get("/", auth, (req, res) => sendReactPath(res));
app.get("/about", auth, (req, res) => sendReactPath(res));
app.get("/notes", auth, (req, res) => sendReactPath(res));

// Error handling middleware

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) does not exist!`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
