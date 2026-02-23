const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth.middleware')
const { isAdmin } = require('../middleware/role.middleware')
const controller = require('../controllers/category.controller')

router.post('/', verifyToken, isAdmin, controller.addCategory)
router.get('/', verifyToken, controller.getAllCategories)

module.exports = router
