const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1️⃣ Create Roles
  const roles = ['admin', 'librarian', 'student'];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    });
  }

  console.log('Roles created');

  // 2️⃣ Create Default Admin
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@library.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@library.com',
      password: hashedPassword,
      roleId: adminRole.id
    }
  });

  console.log('Default admin created');

  // 3️⃣ Create 20 Fake Users (Students)
  const studentRole = await prisma.role.findUnique({
    where: { name: 'student' }
  });

  for (let i = 0; i < 20; i++) {
    const password = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        roleId: studentRole.id
      }
    });
  }

  console.log('20 fake users created');

  // 4️⃣ Create 50 Fake Books
  for (let i = 0; i < 50; i++) {
    const totalCopies = faker.number.int({ min: 1, max: 10 });

    await prisma.book.create({
      data: {
        title: faker.lorem.words(3),
        author: faker.person.fullName(),
        isbn: faker.string.uuid(),
        totalCopies,
        availableCopies: totalCopies
      }
    });
  }

  console.log('50 fake books created');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
