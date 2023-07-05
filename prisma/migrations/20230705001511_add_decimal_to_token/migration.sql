-- Add decimal to token
ALTER TABLE "token" ADD COLUMN "decimal" INT DEFAULT 18;
ALTER TABLE "token" ADD COLUMN "imported" BOOLEAN;
ALTER TABLE "token" ADD COLUMN "burnable" BOOLEAN;
ALTER TABLE "token" ADD COLUMN "firebase_id" TEXT DEFAULT NULL;

-- Add firebase_id to user
ALTER TABLE "user" ADD COLUMN "firebase_id" TEXT DEFAULT NULL;

-- Add firebase_id to organization
ALTER TABLE "organization" ADD COLUMN "firebase_id" TEXT DEFAULT NULL;

-- Add firebase_id to vesting_contract
ALTER TABLE "vesting_contract" ADD COLUMN "firebase_id" TEXT DEFAULT NULL;

-- Add firebase_id to recipe
ALTER TABLE "recipe" ADD COLUMN "firebase_id" TEXT DEFAULT NULL;

-- Add firebase_id to safe_wallet
ALTER TABLE "safe_wallet" ADD COLUMN "firebase_id" TEXT DEFAULT NULL;

-- Update cliff_amount field to TEXT in vesting
ALTER TABLE "vesting" ADD COLUMN "cliff_amount_temp" TEXT DEFAULT '0';
UPDATE "vesting" SET "cliff_amount_temp" = CAST("cliff_amount" AS TEXT);
ALTER TABLE "vesting" DROP COLUMN "cliff_amount";
ALTER TABLE "vesting" RENAME COLUMN "cliff_amount_temp" TO "cliff_amount";

-- Update cliff_amount field to TEXT in vesting_template
ALTER TABLE "vesting_template" ADD COLUMN "cliff_amount_temp" TEXT DEFAULT '0';
UPDATE "vesting_template" SET "cliff_amount_temp" = CAST("cliff_amount" AS TEXT);
ALTER TABLE "vesting_template" DROP COLUMN "cliff_amount";
ALTER TABLE "vesting_template" RENAME COLUMN "cliff_amount_temp" TO "cliff_amount";
