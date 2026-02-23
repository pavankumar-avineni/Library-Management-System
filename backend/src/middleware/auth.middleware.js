const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true }
    })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

module.exports = auth