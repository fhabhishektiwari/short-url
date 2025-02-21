const express = require("express");
const router = require("./routers/url");
const connectToMongoDb = require("./connect");
const URL = require("./models/url");

const app = express();

const PORT = 8080;

// middleware
app.use(express.json());

// MongoDB connection
connectToMongoDb("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDb connected")
);

app.use("/url", router);
app.get("/:shortId", async (req, res) => {
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
