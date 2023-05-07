-- CreateTable
CREATE TABLE "safe_owner" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "safe_wallet_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "safe_owner_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "safe_owner" ADD CONSTRAINT "safe_owner_safe_wallet_id_fkey" FOREIGN KEY ("safe_wallet_id") REFERENCES "safe_wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
