const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const {
  ISSUE_DURATION_DAYS
} = require('../utils/constants');
const {
  FINE_PER_DAY,
  GRACE_PERIOD_DAYS,
  MAX_FINE_LIMIT
} = require('../utils/constants');


exports.issueBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check unpaid fine
    const unpaidFine = await prisma.issue.findFirst({
      where: {
        userId,
        fineAmount: { gt: 0 },
        finePaid: false
      }
    });

    if (unpaidFine) {
      return res.status(400).json({
        message: "User has unpaid fines"
      });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({
        message: "Book not available"
      });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + ISSUE_DURATION_DAYS);

    const issue = await prisma.issue.create({
      data: {
        userId,
        bookId,
        dueDate
      }
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        availableCopies: {
          decrement: 1
        }
      }
    });

    res.status(201).json(issue);

  } catch (error) {
    next(error);
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id: Number(id) }
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.returnDate) {
      return res.status(400).json({ message: "Book already returned" });
    }

    const returnDate = new Date();
    let fine = 0;

    if (returnDate > issue.dueDate) {

      const diffTime = returnDate - issue.dueDate;
      const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const effectiveDays = Math.max(0, overdueDays - GRACE_PERIOD_DAYS);

      fine = effectiveDays * FINE_PER_DAY;

      if (fine > MAX_FINE_LIMIT) {
        fine = MAX_FINE_LIMIT;
      }
    }

    await prisma.issue.update({
      where: { id: Number(id) },
      data: {
        returnDate,
        fineAmount: fine
      }
    });

    await prisma.book.update({
      where: { id: issue.bookId },
      data: {
        availableCopies: {
          increment: 1
        }
      }
    });

    res.json({
      message: "Book returned successfully",
      fine
    });

  } catch (error) {
    next(error);
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

exports.payFine = async (req, res, next) => {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id: Number(id) }
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.fineAmount <= 0) {
      return res.status(400).json({ message: "No fine to pay" });
    }

    await prisma.issue.update({
      where: { id: Number(id) },
      data: {
        finePaid: true
      }
    });

    res.json({
      message: "Fine paid successfully"
    });

  } catch (error) {
    next(error);
  }
};
