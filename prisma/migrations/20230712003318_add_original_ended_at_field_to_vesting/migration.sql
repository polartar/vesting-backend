-- Add original_ended_at to vesting
ALTER TABLE "vesting" ADD COLUMN "original_ended_at" TIMESTAMP(3);

UPDATE "vesting" SET "original_ended_at" = "ended_at";
