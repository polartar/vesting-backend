CREATE TABLE "membership" (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "key" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  CONSTRAINT "membership_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "membership" ADD COLUMN "deleted_at"  TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "membership_key_key" ON "membership"("key");
CREATE UNIQUE INDEX "membership_organization_id_key" ON "membership"("organization_id");

-- Add Foreign Key
ALTER TABLE "membership" ADD CONSTRAINT "membership_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
