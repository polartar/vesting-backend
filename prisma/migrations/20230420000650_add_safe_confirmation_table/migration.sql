-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "safe_confirmation" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "safe_wallet_id" TEXT NOT NULL,
    "safe_owner_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "status" "ConfirmationStatus" NOT NULL,

    CONSTRAINT "safe_confirmation_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "safe_confirmation" ADD CONSTRAINT "safe_confirmation_safe_wallet_id_fkey" FOREIGN KEY ("safe_wallet_id") REFERENCES "safe_wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "safe_confirmation" ADD CONSTRAINT "safe_confirmation_safe_owner_id_fkey" FOREIGN KEY ("safe_owner_id") REFERENCES "safe_owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "safe_confirmation" ADD CONSTRAINT "safe_confirmation_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
