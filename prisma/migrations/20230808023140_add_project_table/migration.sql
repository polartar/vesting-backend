-- CreateTable
CREATE TABLE "project" (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "name" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "chain_id" INTEGER NOT NULL,
  "is_live" BOOLEAN NOT NULL DEFAULT false,
  "contract" TEXT NOT NULL,
  "wallet" TEXT NOT NULL,

  CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "project" ADD COLUMN "deleted_at"  TIMESTAMP(3);

-- Add Foreign Key
ALTER TABLE "project" ADD CONSTRAINT "project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "project_entity" (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "project_id" TEXT NOT NULL,
  "entity_id" TEXT NOT NULL,

  CONSTRAINT "project_entity_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "project_entity_pkey" ADD CONSTRAINT "project_entity_pkey_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "project_entity_pkey" ADD CONSTRAINT "project_entity_pkey_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
