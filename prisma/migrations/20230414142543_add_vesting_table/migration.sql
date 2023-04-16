-- CreateEnum
CREATE TYPE "ReleaseFrequencyType" AS ENUM ('CONTINUOUS', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CliffDurationType" AS ENUM ('NO_CLIFF', 'WEEKS', 'MONTHS', 'YEARS');

-- CreateTable
CREATE TABLE "vesting" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,
    "vesting_contract_id" TEXT,
    "token_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "release_frequency_type" "ReleaseFrequencyType" NOT NULL DEFAULT 'CONTINUOUS',
    "release_frequency" INTEGER NOT NULL,
    "cliff_duration_type" "CliffDurationType" NOT NULL DEFAULT 'NO_CLIFF',
    "cliff_duration" INTEGER NOT NULL DEFAULT 0,
    "cliff_amount" INTEGER NOT NULL DEFAULT 0,
    "amount" TEXT NOT NULL,

    CONSTRAINT "vesting_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "vesting" ADD CONSTRAINT "vesting_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "vesting" ADD CONSTRAINT "vesting_vesting_contract_id_fkey" FOREIGN KEY ("vesting_contract_id") REFERENCES "vesting_contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "vesting" ADD CONSTRAINT "vesting_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
