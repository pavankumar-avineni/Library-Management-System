const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Create roles safely
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: { name: "student" },
  });

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@library.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@library.com",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });