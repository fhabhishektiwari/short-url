const express = require("express");
const path = require("path");
const router = require("./routers/url");
const connectToMongoDb = require("./connect");
const URL = require("./models/url");
const staticRoute = require("./routers/staticRouter");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
connectToMongoDb("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDb connected")
);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  res.render("home", {
    urls: allUrls,
  });
});

app.use("/url", router);
app.use("/", staticRoute);
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
