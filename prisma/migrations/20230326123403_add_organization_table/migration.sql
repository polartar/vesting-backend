-- CreateEnum
CREATE TYPE "Role" AS ENUM (
  'RECIPIENT_FOUNDER',
  'RECIPIENT_ADVISOR',
  'RECIPIENT_EMPLOYEE',
  'RECIPIENT_INVESTOR',
  'MEMBER_FOUNDER',
  'MEMBER_MANAGER',
  'MEMBER_EMPLOYEE'
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'MEMBER_FOUNDER'
);

-- Add Foreign Key
ALTER TABLE "organization" ADD CONSTRAINT "organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
