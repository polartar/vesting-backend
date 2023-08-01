-- User
ALTER TABLE "user" ADD COLUMN "deleted_at" TIMESTAMP(3);

ALTER TABLE "user" DROP COLUMN "is_active";

-- Organization
ALTER TABLE "organization" ADD COLUMN "deleted_at" TIMESTAMP(3);

-- Token
ALTER TABLE "token" ADD COLUMN "deleted_at" TIMESTAMP(3);

-- VestingContract
ALTER TABLE "vesting_contract" ADD COLUMN "deleted_at" TIMESTAMP(3);

-- Vesting
ALTER TABLE "vesting" ADD COLUMN "deleted_at" TIMESTAMP(3);

-- VestingTemplate
ALTER TABLE "vesting_template" ADD COLUMN "deleted_at" TIMESTAMP(3);

-- Recipe
ALTER TABLE "recipe" ADD COLUMN "deleted_at" TIMESTAMP(3);
