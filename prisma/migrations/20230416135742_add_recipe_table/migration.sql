-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('ACCEPTED', 'PENDING', 'REVOKED');

-- CreateTable
CREATE TABLE "recipe" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vesting_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "allocations" TEXT NOT NULL,
    "status" "RecipeStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_vesting_id_fkey" FOREIGN KEY ("vesting_id") REFERENCES "vesting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
