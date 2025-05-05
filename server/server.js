const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

var fs = require('fs');

var morgan = require('morgan');

var path = require('path');

const rateLimit = require('express-rate-limit');
const mongoosePaginate = require('./src/utils/mongoosePaginate');

const indexRouter = require("./src/routes/index");

const app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


app.use(morgan('combined', { stream: accessLogStream }))

const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/book-review-system";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
  
  mongoosePaginate();
  console.log("MongoDB connected and paginate initialized");
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  exposedHeaders: ["Authorization","Link"],
  origin: '*'
}));

// rate limiters
const authenticatedLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 90, // 90 requests per minute
  message: 'Too many requests, please try later.',
});
const nonAuthenticatedLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 50, // 50 requests per minute
  message: 'Too many requests, please try later.',
});

app.use((req, res, next) => {
  if (req.user) {
    authenticatedLimiter(req, res, next); 
  } else {
    nonAuthenticatedLimiter(req, res, next); 
  }
});

app.use((req, res, next) => {
  console.log(`Received request for route: ${req.originalUrl}`);
  next()
});

app.use("/api", indexRouter);

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;