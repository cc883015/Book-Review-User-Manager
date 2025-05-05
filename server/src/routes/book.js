const express = require("express");

const controller = require("../controllers/book");

const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

const router = express.Router();

// 获取所有图书 - 公开
router.route("/")
    .get(validatePaginateQueryParams, controller.list);

// 获取单本图书 - 公开
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail);

// 以下操作需要管理员权限
router.route("/")
    .all(authenticateWithJwt)
    .post(controller.checkAdmin, controller.create);

router.route("/:id")
    .all(authenticateWithJwt)
    .all(validateMongoId('id'))
    .all(controller.checkAdmin)
    .put(controller.update)
    .delete(controller.delete);

module.exports = router;
