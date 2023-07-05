-- Add firebaseId to Vesting
ALTER TABLE "vesting" ADD COLUMN "firebase_id" TEXT DEFAULT NULL;
