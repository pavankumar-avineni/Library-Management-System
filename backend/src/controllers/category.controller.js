const prisma = require('../config/prisma')

exports.addCategory = async (req, res) => {
  const { name } = req.body
  const category = await prisma.category.create({ data: { name } })
  res.json(category)
}

exports.getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany()
  res.json(categories)
}
