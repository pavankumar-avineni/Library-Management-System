const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

const {
  getBooks,
  createBook
} = require('../controllers/book.controller')

router.get('/', getBooks)
router.post('/', auth, role('admin'), createBook)

module.exports = router