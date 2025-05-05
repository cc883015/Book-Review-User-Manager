const express = require("express");

const controller = require("../controllers/review");

const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

const router = express.Router();

// 获取所有评论 - 公开
router.route("/")
    .get(validatePaginateQueryParams, controller.list);

// 获取特定图书的评论 - 公开
router.route("/book/:bookId")
    .all(validateMongoId('bookId'))
    .get(validatePaginateQueryParams, controller.listByBook);

// 获取特定用户的评论 - 需要认证
router.route("/user/:userId")
    .all(authenticateWithJwt)
    .all(validateMongoId('userId'))
    .get(validatePaginateQueryParams, controller.listByUser);

// 获取单条评论 - 公开
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail);

// 创建评论 - 需要认证
router.route("/")
    .all(authenticateWithJwt)
    .post(controller.create);

// 更新和删除评论 - 需要认证且只能操作自己的评论或管理员
router.route("/:id")
    .all(authenticateWithJwt)
    .all(validateMongoId('id'))
    .put(controller.checkOwnerOrAdmin, controller.update)
    .delete(controller.checkOwnerOrAdmin, controller.delete);

module.exports = router;
