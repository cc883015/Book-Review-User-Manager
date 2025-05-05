const mongoose = require('mongoose');

const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

const { body, query, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// 检查是否为管理员的中间件
exports.checkAdmin = (req, res, next) => {
    if (!req.user.is_admin) {
        return res.status(403).json({ error: "Only administrators can perform this operation" });
    }
    next();
};

// 图书验证规则
const bookValidator = () => {
    return [
        body('title')
            .notEmpty().withMessage('The title cannot be empty')
            .isString().withMessage('The title must be a string'),

        body('author')
            .notEmpty().withMessage('The author cannot be empty')
            .isString().withMessage('The author must be a string'),

        body('description')
            .notEmpty().withMessage('The description cannot be empty')
            .isString().withMessage('The description must be a string'),

        body('publishDate')
            .notEmpty().withMessage('The publication date cannot be empty')
            .custom(value => !isNaN(Date.parse(value))).withMessage('The publication date must be the valid date'),

        body('isbn')
            .notEmpty().withMessage('SBN cannot be empty')
            .isString().withMessage('The ISBN must be a string'),

        body('coverImage')
            .optional()
            .isURL().withMessage('The cover image must be a valid URL')
    ];
};

// 获取所有图书
exports.list = [
    query('title').optional().trim(),
    query('author').optional().trim(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
   //filter and sort related title or author
        const title = req.query.title || '';
        const author = req.query.author || '';

        let filters = {
            title: new RegExp(title, 'i'),
            author: new RegExp(author, 'i')
        };

        const bookPage = await Book
            .find(filters)
            .sort({ title: 'asc' })
            .lean()
            .paginate(req.paginate);
        
        res
            .status(200)
            .links(generatePaginationLinks(
                req.originalUrl,
                req.paginate.page,
                bookPage.totalPages,
                req.paginate.limit
            ))
            .json(bookPage.docs);
    })
];

// 获取单本图书
exports.detail = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (book === null) {
        return res.status(404).json({ error: "no book" });
    }

    res.json(book);
});

// 创建图书
exports.create = [
    bookValidator(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            publishDate: req.body.publishDate,
            isbn: req.body.isbn,
            coverImage: req.body.coverImage || "https://covers.openlibrary.org/b/id/8091016-L.jpg",
            addedBy: req.user.user_id
        });

        await book.save();
        res.status(201).json(book);
    })
];

// 更新图书
exports.update = [
    bookValidator(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 检查图书是否存在
        const book = await Book.findById(req.params.id);
        if (book === null) {
            return res.status(404).json({ error: "no book" });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    title: req.body.title,
                    author: req.body.author,
                    description: req.body.description,
                    publishDate: req.body.publishDate,
                    isbn: req.body.isbn,
                    coverImage: req.body.coverImage || book.coverImage
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedBook);
    })
];

// 删除图书
exports.delete = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (book === null) {
        return res.status(404).json({ error: "no book" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "The book has been successfully deleted" });
});
