-- CreateTable
CREATE TABLE "token" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'VTVL Certified Token',
    "symbol" TEXT NOT NULL DEFAULT E'VTVLTOKEN',
    "description" TEXT,
    "max_supply" TEXT,
    "chain_id" INTEGER,
    "address" TEXT,
    "logo" TEXT,
    "is_deployed" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_token" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL
);

-- Add Foreign Key
ALTER TABLE "organization_token" ADD CONSTRAINT "organization_token_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "organization_token" ADD CONSTRAINT "organization_token_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
