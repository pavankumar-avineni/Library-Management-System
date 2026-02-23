const prisma = require('../config/prisma')

exports.getMyIssues = async (req, res) => {
  try {
    const issues = await prisma.issue.findMany({
      where: { userId: req.user.id },
      include: { book: true }
    })

    res.json(issues)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

exports.returnBook = async (req, res) => {
  try {
    const issueId = Number(req.params.id)

    const issue = await prisma.issue.findUnique({
      where: { id: issueId }
    })

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" })
    }

    await prisma.book.update({
      where: { id: issue.bookId },
      data: {
        availableCopies: { increment: 1 }
      }
    })

    await prisma.issue.delete({
      where: { id: issueId }
    })

    res.json({ message: "Book returned successfully" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}