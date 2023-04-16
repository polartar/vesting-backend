-- CreateTable
CREATE TABLE "vesting_contract" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "transaction" TEXT,
    "chain_id" INTEGER,
    "organization_id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "is_deployed" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vesting_contract_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "vesting_contract" ADD CONSTRAINT "vesting_contract_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
