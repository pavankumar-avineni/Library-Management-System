const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

const {
  requestBook,
  getAllRequests,
  approveRequest,
  rejectRequest,
  getMyIssues,
  returnBook
} = require('../controllers/bookRequest.controller')

router.post('/', auth, role('student'), requestBook)
router.get('/', auth, role('admin'), getAllRequests)
router.post('/approve/:id', auth, role('admin'), approveRequest)
router.post('/reject/:id', auth, role('admin'), rejectRequest)
router.get('/my-issues', auth, role('student'), getMyIssues)
router.post('/return/:id', auth, role('student'), returnBook)

module.exports = router