const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')

const {
  getMyIssues,
  returnBook
} = require('../controllers/issue.controller')

router.get('/my', auth, getMyIssues)
router.post('/return/:id', auth, returnBook)

module.exports = router