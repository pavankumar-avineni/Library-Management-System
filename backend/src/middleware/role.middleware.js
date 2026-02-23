module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (req.user.role.name !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" })
    }

    next()
  }
}