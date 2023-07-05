import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AdminUsers = [
  {
    name: 'Nisha',
    email: 'nisha@vtvl.io',
  },
  {
    name: 'Lawrence',
    email: 'lawrence@vtvl.io',
  },
  {
    name: 'Andy',
    email: 'andy@vtvl.io',
  },
  {
    name: 'Danny',
    email: 'danny@vtvl.io',
  },
  {
    name: 'Arvin',
    email: 'arvin@vtvl.io',
  },
  {
    name: 'Muhammad',
    email: 'muhammad@vtvl.io',
  },
];

export const migrateAdminUsers = async () => {
  console.log('Seeding admin users...');

  for (const user of AdminUsers) {
    const dbUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!dbUser) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          isActive: true,
          isAdmin: true,
        },
      });
    }
  }

  console.log('Seeding Ended');
};
