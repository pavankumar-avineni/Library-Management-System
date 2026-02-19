require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const issueRoutes = require('./routes/issue.routes');
const setupSwagger = require('./config/swagger'); 
const errorHandler = require('./middlewares/error.middleware');
const { apiLimiter } = require("./middlewares/rateLimiter.middleware");




const app = express();

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

 
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/issues', issueRoutes);


setupSwagger(app);
app.use(errorHandler);
app.get('/', (req, res) => {
  res.json({ message: 'Library Management System API Running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
