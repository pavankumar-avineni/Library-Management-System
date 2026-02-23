const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name
      }
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get USER role
    const userRole = await prisma.role.findFirst({
      where: { name: { equals: "student", mode: "insensitive" }}
    });

    if (!userRole) {
      return res.status(500).json({ message: "USER role not found. Seed roles first." });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: userRole.id
      }
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};