-- CreateEnum
CREATE TYPE "VestingContractStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'INITIALIZED');

ALTER TABLE "vesting_contract" ADD COLUMN "status" "VestingContractStatus" NOT NULL DEFAULT E'INITIALIZED';
