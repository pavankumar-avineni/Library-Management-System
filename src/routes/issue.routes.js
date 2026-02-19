const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');


const issueController = require('../controllers/issue.controller');


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

router.post('/issue', verifyToken, authorizeRoles('student', 'admin'), issueController.issueBook);
router.post('/return', verifyToken, authorizeRoles('student', 'admin'), issueController.returnBook);

router.get('/', verifyToken, authorizeRoles('admin', 'librarian'), issueController.getAllIssuedBooks);
router.get('/my', verifyToken, issueController.getMyIssuedBooks);
router.post('/:id/pay-fine', verifyToken, issueController.payFine);
router.post('/', verifyToken, issueController.issueBook);
router.patch('/:id/return', verifyToken, issueController.returnBook);
router.post('/:id/pay-fine', verifyToken, issueController.payFine);

module.exports = router;
