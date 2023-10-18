-- CreateEnum
CREATE TYPE "MilestoneVestingType" AS ENUM ('SIMPLE', 'VESTED');

-- DropForeignKey
ALTER TABLE "recipe" DROP CONSTRAINT "recipe_vesting_id_fkey";

-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "milestone_vesting_id" TEXT,
ALTER COLUMN "vesting_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "burnable" SET DEFAULT false;

-- AlterTable
ALTER TABLE "vesting_contract" ADD COLUMN     "is_timebased" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "milestone_vesting" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "organization_id" TEXT NOT NULL,
    "vesting_contract_id" TEXT NOT NULL,
    "transaction_id" TEXT,
    "status" "VestingStatus" NOT NULL DEFAULT 'INITIALIZED',
    "type" "MilestoneVestingType" NOT NULL,
    "templateId" TEXT,

    CONSTRAINT "milestone_vesting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_vesting_template" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "milestone_vesting_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone" (
    "id" TEXT NOT NULL,
    "allocation" TEXT NOT NULL,
    "description" TEXT,
    "release_frequency_type" "ReleaseFrequencyType" NOT NULL DEFAULT 'MONTHLY',
    "title" TEXT NOT NULL,
    "vesting_id" TEXT,
    "template_id" TEXT,
    "duration" JSONB NOT NULL,

    CONSTRAINT "milestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_vesting_id_fkey" FOREIGN KEY ("vesting_id") REFERENCES "vesting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_milestone_vesting_id_fkey" FOREIGN KEY ("milestone_vesting_id") REFERENCES "milestone_vesting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_vesting" ADD CONSTRAINT "milestone_vesting_vesting_contract_id_fkey" FOREIGN KEY ("vesting_contract_id") REFERENCES "vesting_contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_vesting" ADD CONSTRAINT "milestone_vesting_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "milestone_vesting_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_vesting_template" ADD CONSTRAINT "milestone_vesting_template_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone" ADD CONSTRAINT "milestone_vesting_id_fkey" FOREIGN KEY ("vesting_id") REFERENCES "milestone_vesting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone" ADD CONSTRAINT "milestone_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "milestone_vesting_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
