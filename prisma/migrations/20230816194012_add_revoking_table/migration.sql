-- CreateTable
CREATE TABLE "revoking" (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "chain_id" INTEGER NOT NULL,
  "organization_id" TEXT NOT NULL,
  "vesting_id" TEXT NOT NULL,
  "recipe_id" TEXT NOT NULL,
  "transaction_id" TEXT,
  "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
  CONSTRAINT "revoking_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "revoking" ADD CONSTRAINT "revoking_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "revoking" ADD CONSTRAINT "revoking_vesting_id_fkey" FOREIGN KEY ("vesting_id") REFERENCES "vesting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "revoking" ADD CONSTRAINT "revoking_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
