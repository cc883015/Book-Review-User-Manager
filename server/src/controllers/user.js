const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");

// 检查是否为管理员的中间件
exports.checkAdmin = (req, res, next) => {
    if (!req.user.is_admin) {
        return res.status(403).json({ error: "Only administrators can use this operation" });
    }
    next();
};

// 用户验证规则
const userValidator = () => {
    return [
        body('username')
            .notEmpty().withMessage('The username cannot be empty')
            .isString().withMessage('The username must be a string')
            .custom(async (value) => {
                const existingUser = await User.findOne({ username: value });
                if (existingUser) {
                    throw new Error('The username has been used');
                }
                return true;
            }),

        body('password')
            .notEmpty().withMessage('The password cannot be empty')
            .isLength({ min: 6 }).withMessage('The password length should be at least 6 characters'),

        body('is_admin')
            .optional()
            .isBoolean().withMessage('is_admin must be a Boolean value')
    ];
};

// 获取所有用户
exports.list = [
    asyncHandler(async (req, res, next) => {
        const userPage = await User
            .find({}, { password: 0 }) // 排除密码字段
            .sort({ username: 'asc' })
            .lean()
            .paginate(req.paginate);

        res
            .status(200)
            .links(generatePaginationLinks(
                req.originalUrl,
                req.paginate.page,
                userPage.totalPages,
                req.paginate.limit
            ))
            .json(userPage.docs);
    })
];

// 获取单个用户
exports.detail = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id, { password: 0 }); // 排除密码字段

    if (user === null) {
        return res.status(404).json({ error: "The user does not exist." });
    }

    res.json(user);
});

// 创建用户
exports.create = [
    userValidator(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            is_admin: req.body.is_admin || false
        });

        await user.save();

        // 返回用户信息，但排除密码
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    })
];

// 更新用户
exports.update = [
    body('username')
        .optional()
        .isString().withMessage('The username must be a string')
        .custom(async (value, { req }) => {
            const existingUser = await User.findOne({ username: value });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                throw new Error('The username has been used');
            }
            return true;
        }),

    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('the password length should be at least 6 characters'),

    body('is_admin')
        .optional()
        .isBoolean().withMessage('is_admin must be a Boolean value'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 检查用户是否存在
        const user = await User.findById(req.params.id);
        if (user === null) {
            return res.status(404).json({ error: "The user  not exist." });
        }

         // 准备更新数据
        const updateData = {};
        if (req.body.username) updateData.username = req.body.username;
        if (req.body.password) updateData.password = req.body.password;
        if (req.body.is_admin !== undefined) updateData.is_admin = req.body.is_admin;

         // 如果更新密码，需要重新哈希
        let updatedUser;
        if (req.body.password) {
            // 直接更新用户对象并保存，以触发密码哈希中间件
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
            if (req.body.is_admin !== undefined) user.is_admin = req.body.is_admin;

            updatedUser = await user.save();
        } else {
            // 如果没有更新密码，可以直接使用findByIdAndUpdate
            updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }

        // 返回用户信息，但排除密码
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    })
];

// 删除用户
exports.delete = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (user === null) {
        return res.status(404).json({ error: "The user does not exist." });
    }

    // 防止删除自己
    if (user._id.toString() === req.user.user_id) {
        return res.status(400).json({ error: "The currently logged-in user cannot be deleted" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "The user has been successfully deleted" });
});
