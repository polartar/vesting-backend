CREATE TYPE "TransactionType" AS ENUM ('VESTING_DEPLOYMENT', 'FUNDING_CONTRACT', 'ADDING_CLAIMS', 'TOKEN_DEPLOYMENT', 'REVOKE_CLAIM', 'ADMIN_WITHDRAW');

ALTER TABLE "transaction" ADD COLUMN "type" "TransactionType" NOT NULL;

-- UpdateEnum
ALTER TABLE "transaction" DROP COLUMN "status";

-- Rename Role enum
ALTER TYPE "TransactionStatus" RENAME TO "TransactionStatus_old";

-- Delete old Role enum
DROP TYPE "TransactionStatus_old";

CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

ALTER TABLE "transaction" ADD COLUMN "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

ALTER TABLE "transaction" ADD COLUMN "safe_hash" TEXT;

ALTER TABLE "transaction" ADD COLUMN "organization_id" TEXT NOT NULL;
