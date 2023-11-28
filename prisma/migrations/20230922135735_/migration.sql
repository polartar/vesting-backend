/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `is_deployed` on the `vesting` table. All the data in the column will be lost.
  - The `domains` column on the `website` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `decimal` on table `token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imported` on table `token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `burnable` on table `token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `to` on table `transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `user_role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isAccepted` on table `user_role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vesting_contract_id` on table `vesting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cliff_amount` on table `vesting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `original_ended_at` on table `vesting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cliff_amount` on table `vesting_template` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InstitutionalRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- DropForeignKey
ALTER TABLE "revoking" DROP CONSTRAINT "revoking_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "safe_wallet" DROP CONSTRAINT "safe_wallet_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "safe_wallet" DROP CONSTRAINT "safe_wallet_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "vesting" DROP CONSTRAINT "vesting_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "vesting_contract" DROP CONSTRAINT "vesting_contract_transaction_id_fkey";

-- AlterTable
ALTER TABLE "organization_token" ADD CONSTRAINT "organization_token_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "project" DROP COLUMN "deleted_at",
ALTER COLUMN "is_live" DROP DEFAULT;

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "symbol" DROP DEFAULT,
ALTER COLUMN "decimal" SET NOT NULL,
ALTER COLUMN "decimal" DROP DEFAULT,
ALTER COLUMN "imported" SET NOT NULL,
ALTER COLUMN "imported" DROP DEFAULT,
ALTER COLUMN "burnable" SET NOT NULL,
ALTER COLUMN "burnable" DROP DEFAULT;

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "to" SET NOT NULL,
ALTER COLUMN "to" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_permission" ALTER COLUMN "permissions" DROP NOT NULL,
ALTER COLUMN "permissions" DROP DEFAULT,
ALTER COLUMN "permissions" SET DATA TYPE JSONB;

-- AlterTable
ALTER TABLE "user_role" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "isAccepted" SET NOT NULL,
ADD CONSTRAINT "user_role_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vesting" DROP COLUMN "is_deployed",
ALTER COLUMN "vesting_contract_id" SET NOT NULL,
ALTER COLUMN "cliff_amount" SET NOT NULL,
ALTER COLUMN "original_ended_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "vesting_contract" ALTER COLUMN "balance" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vesting_template" ALTER COLUMN "cliff_amount" SET NOT NULL;

-- AlterTable
ALTER TABLE "website" DROP COLUMN "domains",
ADD COLUMN     "domains" JSONB[],
ALTER COLUMN "features" DROP NOT NULL,
ALTER COLUMN "features" DROP DEFAULT,
ALTER COLUMN "assets" DROP NOT NULL,
ALTER COLUMN "assets" DROP DEFAULT,
ALTER COLUMN "links" DROP NOT NULL,
ALTER COLUMN "links" DROP DEFAULT,
ALTER COLUMN "styles" DROP NOT NULL,
ALTER COLUMN "styles" DROP DEFAULT;

-- CreateTable
CREATE TABLE "membership" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "organization_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "membership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vesting_contract" ADD CONSTRAINT "vesting_contract_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vesting_contract" ADD CONSTRAINT "vesting_contract_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vesting" ADD CONSTRAINT "vesting_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_email_fkey" FOREIGN KEY ("email") REFERENCES "user"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_address_fkey" FOREIGN KEY ("address") REFERENCES "wallet"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_wallet" ADD CONSTRAINT "safe_wallet_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "safe_owner" ADD CONSTRAINT "safe_owner_address_fkey" FOREIGN KEY ("address") REFERENCES "wallet"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revoking" ADD CONSTRAINT "revoking_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
