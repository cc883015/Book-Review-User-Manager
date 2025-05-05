const express = require("express");

const controller = require("../controllers/user");

const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

const router = express.Router();

// 所有用户路由都需要管理员权限
router.use(authenticateWithJwt);
router.use(controller.checkAdmin);

// 获取所有用户
router.route("/")
    .get(validatePaginateQueryParams, controller.list);

// 获取单个用户
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail);

// 创建用户
router.route("/")
    .post(controller.create);

// 更新和删除用户
router.route("/:id")
    .all(validateMongoId('id'))
    .put(controller.update)
    .delete(controller.delete);

module.exports = router;
