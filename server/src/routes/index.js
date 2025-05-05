const express = require("express");

const AuthenticationRouter = require("./auth");
const BookRouter = require("./book");
const ReviewRouter = require("./review");
const UserRouter = require("./user");

const router = express.Router();

router.use('/auth', AuthenticationRouter);
router.use('/books', BookRouter);
router.use('/reviews', ReviewRouter);
router.use('/users', UserRouter);

module.exports = router;