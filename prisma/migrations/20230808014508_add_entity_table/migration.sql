-- CreateTable
CREATE TABLE "entity" (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "name" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,

  CONSTRAINT "entity_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "entity" ADD CONSTRAINT "entity_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "website" DROP COLUMN "deleted_at";

ALTER TABLE "website" ADD COLUMN "deleted_at" TIMESTAMP(3);

ALTER TABLE "entity" ADD COLUMN "deleted_at"  TIMESTAMP(3);
