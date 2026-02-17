const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const {
  addBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');

router.post(
  '/',
  verifyToken,
  authorizeRoles('admin', 'librarian'),
  addBook
);


/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book Management APIs
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, isbn, totalCopies]
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               totalCopies:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get single book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book details
 */

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book updated
 */

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted
 */

router.get('/', verifyToken, getAllBooks);
router.get('/:id', verifyToken, getSingleBook);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('admin'),
  updateBook
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('admin'),
  deleteBook
);

module.exports = router;