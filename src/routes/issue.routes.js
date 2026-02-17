const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const {
  issueBook,
  returnBook,
  getAllIssuedBooks,
  getMyIssuedBooks
} = require('../controllers/issue.controller');


/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: Issue & Return APIs
 */

/**
 * @swagger
 * /api/issues/issue:
 *   post:
 *     summary: Issue a book
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book issued
 */

/**
 * @swagger
 * /api/issues/return:
 *   post:
 *     summary: Return a book
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [issueId]
 *             properties:
 *               issueId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book returned
 */

/**
 * @swagger
 * /api/issues:
 *   get:
 *     summary: Get all issued books (Admin/Librarian)
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of issued books
 */

/**
 * @swagger
 * /api/issues/my:
 *   get:
 *     summary: Get my issued books
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User issued books
 */

router.post('/issue', verifyToken, authorizeRoles('student', 'admin'), issueBook);
router.post('/return', verifyToken, authorizeRoles('student', 'admin'), returnBook);

router.get('/', verifyToken, authorizeRoles('admin', 'librarian'), getAllIssuedBooks);
router.get('/my', verifyToken, getMyIssuedBooks);

module.exports = router;
