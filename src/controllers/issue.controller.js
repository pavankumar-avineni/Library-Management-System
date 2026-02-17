const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

exports.issueBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const book = await prisma.book.findUnique({
      where: { id: Number(bookId) }
    });

    if (!book) {
      return errorResponse(res, 'Book not found', 404);
    }

    if (book.availableCopies <= 0) {
      return errorResponse(res, 'No copies available', 400);
    }

    const existingIssue = await prisma.issue.findFirst({
      where: {
        userId,
        bookId: Number(bookId),
        status: 'ISSUED'
      }
    });

    if (existingIssue) {
      return errorResponse(res, 'You already issued this book', 400);
    }

    await prisma.$transaction([
      prisma.issue.create({
        data: {
          userId,
          bookId: Number(bookId)
        }
      }),
      prisma.book.update({
        where: { id: Number(bookId) },
        data: {
          availableCopies: {
            decrement: 1
          }
        }
      })
    ]);

    return successResponse(res, 'Book issued successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.returnBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { issueId } = req.body;

    const issue = await prisma.issue.findUnique({
      where: { id: Number(issueId) }
    });

    if (!issue || issue.status === 'RETURNED') {
      return errorResponse(res, 'Invalid issue record', 400);
    }

    await prisma.$transaction([
      prisma.issue.update({
        where: { id: Number(issueId) },
        data: {
          status: 'RETURNED',
          returnDate: new Date()
        }
      }),
      prisma.book.update({
        where: { id: issue.bookId },
        data: {
          availableCopies: {
            increment: 1
          }
        }
      })
    ]);

    return successResponse(res, 'Book returned successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getAllIssuedBooks = async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        user: true,
        book: true
      }
    });

    return successResponse(res, 'All issued books fetched', issues);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.getMyIssuedBooks = async (req, res) => {
  try {
    const userId = req.user.id;

    const issues = await prisma.issue.findMany({
      where: { userId },
      include: { book: true }
    });

    return successResponse(res, 'Your issued books fetched', issues);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};