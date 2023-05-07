-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED');

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "hash" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);
