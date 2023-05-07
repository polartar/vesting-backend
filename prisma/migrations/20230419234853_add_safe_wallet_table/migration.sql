-- CreateTable
CREATE TABLE "safe_wallet" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "required_confirmations" INTEGER NOT NULL,
    "transaction_id" TEXT,

    CONSTRAINT "safe_wallet_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "safe_wallet" ADD CONSTRAINT "safe_wallet_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "safe_wallet" ADD CONSTRAINT "safe_wallet_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
