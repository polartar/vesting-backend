-- Delete Role in UserRole
ALTER TABLE "user_role" DROP COLUMN "role";

-- Rename Role enum
ALTER TYPE "Role" RENAME TO "Role_old";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FOUNDER', 'MANAGER', 'OPERATOR', 'INVESTOR', 'ADVISOR', 'EMPLOYEE');

-- Delete old Role enum
DROP TYPE "Role_old";

-- Add role to UserRole
ALTER TABLE "user_role" ADD COLUMN "role" "Role" DEFAULT E'FOUNDER';
