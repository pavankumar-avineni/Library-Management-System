const prisma = require('../config/prisma')

exports.requestBook = async (req, res) => {
  const { bookId } = req.body

  const request = await prisma.bookRequest.create({
    data: {
      userId: req.user.id,
      bookId: Number(bookId),
      status: "PENDING"
    }
  })

  res.json(request)
}

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.bookRequest.findMany({
      include: {
        user: true,
        book: true
      },
      orderBy: {
        createdAt: "desc"   // 🔥 newest first
      }
    })

    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests" })
  }
}

exports.approveRequest = async (req, res) => {
  const requestId = Number(req.params.id)

  const request = await prisma.bookRequest.findUnique({
    where: { id: requestId },
    include: { book: true }
  })

  if (!request) return res.status(404).json({ message: "Not found" })

  if (request.book.availableCopies <= 0)
    return res.status(400).json({ message: "No copies available" })

  await prisma.issue.create({
    data: {
      userId: request.userId,
      bookId: request.bookId
    }
  })

  await prisma.book.update({
    where: { id: request.bookId },
    data: { availableCopies: { decrement: 1 } }
  })

  await prisma.bookRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" }
  })

  res.json({ message: "Approved" })
}

exports.rejectRequest = async (req, res) => {
  const requestId = Number(req.params.id)

  await prisma.bookRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" }
  })

  res.json({ message: "Rejected" })
}

exports.getMyIssues = async (req, res) => {
  const issues = await prisma.issue.findMany({
    where: { userId: req.user.id },
    include: { book: true }
  })

  res.json(issues)
}

exports.returnBook = async (req, res) => {
  const issueId = Number(req.params.id)

  const issue = await prisma.issue.findUnique({
    where: { id: issueId }
  })

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" })
  }

  // increase available copies
  await prisma.book.update({
    where: { id: issue.bookId },
    data: { availableCopies: { increment: 1 } }
  })

  // delete issue
  await prisma.issue.delete({
    where: { id: issueId }
  })

  res.json({ message: "Book returned successfully" })
}