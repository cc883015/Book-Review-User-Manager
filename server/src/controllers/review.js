const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const Review = require("../models/review");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// Create a rate limiter for reviews - 5 comments per minute per user
const reviewRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // 3 requests per minute
    message: 'You can only submit 5 reviews per minute. Please try again later.',
    keyGenerator: (req) => req.user.user_id, // Use user ID as the key
    standardHeaders: true,
    legacyHeaders: false,
});

// 检查是否为评论所有者或管理员的中间件
exports.checkOwnerOrAdmin = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (review === null) {
        return res.status(404).json({ error: "no comment" });
    }

    if (review.user.toString() !== req.user.user_id && !req.user.is_admin) {
        return res.status(403).json({ error: "There is no permission to modify this comment" });
    }

    next();
});

// 评论验证规则
const reviewValidator = () => {
    return [
        body('book')
            .notEmpty().withMessage('The book ID cannot be empty')
            .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('The book ID must be a valid MongoDB ID'),

        body('rating')
            .notEmpty().withMessage('The score cannot be empty')
            .isInt({ min: 1, max: 5 }).withMessage('The score must be an integer between 1 and 5'),

        body('comment')
            .notEmpty().withMessage('The content of the comment cannot be empty')
            .isString().withMessage('The comment content must be a string')
    ];
};

// 获取所有评论
exports.list = [
    asyncHandler(async (req, res, next) => {
        const reviewPage = await Review
            .find()
            .populate('user', 'username')
            .populate('book', 'title author')
            .sort({ createdAt: 'desc' })
            .lean()
            .paginate(req.paginate);

        res
            .status(200)
            .links(generatePaginationLinks(
                req.originalUrl,
                req.paginate.page,
                reviewPage.totalPages,
                req.paginate.limit
            ))
            .json(reviewPage.docs);
    })
];

// 获取特定图书的评论
exports.listByBook = [
    asyncHandler(async (req, res, next) => {
        const bookId = req.params.bookId;

        // 检查图书是否存在
        const book = await Book.findById(bookId);
        if (book === null) {
            return res.status(404).json({ error: "no book" });
        }

        const reviewPage = await Review
            .find({ book: bookId })
            .populate('user', 'username')
            .sort({ createdAt: 'desc' })
            .lean()
            .paginate(req.paginate);

        res
            .status(200)
            .links(generatePaginationLinks(
                req.originalUrl,
                req.paginate.page,
                reviewPage.totalPages,
                req.paginate.limit
            ))
            .json(reviewPage.docs);
    })
];

// 获取特定用户的评论
exports.listByUser = [
    asyncHandler(async (req, res, next) => {
        const userId = req.params.userId;

        // 只允许用户查看自己的评论，除非是管理员
        if (userId !== req.user.user_id && !req.user.is_admin) {
            return res.status(403).json({ error: "You do not have the permission to view this user's comments" });
        }

        const reviewPage = await Review
            .find({ user: userId })
            .populate('book', 'title author coverImage')
            .sort({ createdAt: 'desc' })
            .lean()
            .paginate(req.paginate);

        res
            .status(200)
            .links(generatePaginationLinks(
                req.originalUrl,
                req.paginate.page,
                reviewPage.totalPages,
                req.paginate.limit
            ))
            .json(reviewPage.docs);
    })
];

// 获取单条评论
exports.detail = asyncHandler(async (req, res, next) => {
    const review = await Review
        .findById(req.params.id)
        .populate('user', 'username')
        .populate('book', 'title author');

    if (review === null) {
        return res.status(404).json({ error: "no comment" });
    }

    res.json(review);
});

// 创建评论
exports.create = [
    reviewRateLimiter,
    reviewValidator(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 检查图书是否存在
        const book = await Book.findById(req.body.book);
        if (book === null) {
            return res.status(404).json({ error: "no book" });
        }

        // 检查用户是否已经评价过此书
        const existingReview = await Review.findOne({
            book: req.body.book,
            user: req.user.user_id
        });

        if (existingReview) {
            return res.status(400).json({ error: "You have already evaluated this book" });
        }

        const review = new Review({
            book: req.body.book,
            user: req.user.user_id,
            rating: req.body.rating,
            comment: req.body.comment
        });

        await review.save();

        // 返回填充了用户和图书信息的评论
        const populatedReview = await Review
            .findById(review._id)
            .populate('user', 'username')
            .populate('book', 'title author');

        res.status(201).json(populatedReview);
    })
];

// 更新评论
exports.update = [
    reviewRateLimiter,
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('The score must be an integer between 1 and 5'),

    body('comment')
        .optional()
        .isString().withMessage('The comment content must be a string'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const review = await Review.findById(req.params.id);

        const updateData = {};
        if (req.body.rating) updateData.rating = req.body.rating;
        if (req.body.comment) updateData.comment = req.body.comment;

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('user', 'username')
        .populate('book', 'title author');

        res.status(200).json(updatedReview);
    })
];

// 删除评论
exports.delete = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "The comment has been successfully deleted" });
});
