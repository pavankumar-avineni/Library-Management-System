require('dotenv').config()
const express = require('express')
const cors = require('cors')
const prisma = require('./config/prisma')

const authRoutes = require('./routes/auth.routes')
const bookRoutes = require('./routes/book.routes')
const bookRequestRoutes = require('./routes/bookRequest.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/requests', bookRequestRoutes)

app.get('/', (req, res) => {
  res.send("Library API Running")
})

const PORT = 5000

prisma.$connect().then(() => {
  console.log("Database connected")
  app.listen(PORT, () => {
    console.log("Server running on port", PORT)
  })
})