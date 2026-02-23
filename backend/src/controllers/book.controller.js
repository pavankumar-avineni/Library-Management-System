const prisma = require('../config/prisma')

exports.getBooks = async (req, res) => {
  const books = await prisma.book.findMany()
  res.json(books)
}

exports.createBook = async (req, res) => {
  const { title, author, totalCopies } = req.body

  const book = await prisma.book.create({
    data: {
      title,
      author,
      totalCopies,
      availableCopies: totalCopies
    }
  })

  res.json(book)
}