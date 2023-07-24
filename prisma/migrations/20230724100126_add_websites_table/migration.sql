-- CreateTable
CREATE TABLE "website" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,
    "email" TEXT,
    "domains" TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    "features" JSONB NOT NULL DEFAULT '{}'::JSONB,
    "assets" JSONB NOT NULL DEFAULT '{}'::JSONB,
    "links" JSONB NOT NULL DEFAULT '{}'::JSONB,
    "styles" JSONB NOT NULL DEFAULT '{}'::JSONB,

    CONSTRAINT "website_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "website" ADD CONSTRAINT "website_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
