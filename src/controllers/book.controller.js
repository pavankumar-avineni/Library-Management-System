const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

exports.addBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, totalCopies } = req.body;

  const existingBook = await prisma.book.findUnique({
    where: { isbn }
  });

  if (existingBook) {
    return errorResponse(res, 'Book already exists', 400);
  }

  const book = await prisma.book.create({
    data: {
      title,
      author,
      isbn,
      totalCopies,
      availableCopies: totalCopies
    }
  });

  return successResponse(res, 'Book added successfully', book, 201);
});

exports.getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    return successResponse(res, 'Books fetched successfully', books);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id: Number(id) }
    });

    if (!book) {
      return errorResponse(res, 'Book not found', 404);
    }

    return successResponse(res, 'Book fetched successfully', book);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, totalCopies } = req.body;

    const book = await prisma.book.findUnique({
      where: { id: Number(id) }
    });

    if (!book) {
      return errorResponse(res, 'Book not found', 404);
    }

    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        totalCopies
      }
    });

    return successResponse(res, 'Book updated successfully', updatedBook);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.book.delete({
      where: { id: Number(id) }
    });

    return successResponse(res, 'Book deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
