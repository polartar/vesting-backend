-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ADMIN', 'READ');

-- CreateTable
CREATE TABLE "user_permission" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT E'READ',
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_permission_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "user_role" ADD COLUMN "isAccepted" BOOLEAN DEFAULT false;
