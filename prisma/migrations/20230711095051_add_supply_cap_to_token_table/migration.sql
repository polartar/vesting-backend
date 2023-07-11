-- Add SupplyCap to token
ALTER TABLE "token" ADD COLUMN "supply_cap" TEXT DEFAULT NULL;
