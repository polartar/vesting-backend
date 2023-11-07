-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "funding_amount" TEXT DEFAULT '0',
ADD COLUMN     "withdraw_amount" TEXT DEFAULT '0';
