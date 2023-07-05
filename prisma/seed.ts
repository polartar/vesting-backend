import { PrismaClient } from '@prisma/client';
import { migrateAdminUsers } from './seeders/admin';
import { migrateFirebaseDb } from './seeders/firebase';

const prisma = new PrismaClient();

async function main() {
  // Nothing
  await migrateAdminUsers();
  await migrateFirebaseDb();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
