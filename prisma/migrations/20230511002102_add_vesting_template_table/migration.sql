-- CreateTable
CREATE TABLE "vesting_template" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "release_frequency_type" "ReleaseFrequencyType" NOT NULL DEFAULT 'CONTINUOUS',
    "release_frequency" INTEGER NOT NULL,
    "cliff_duration_type" "CliffDurationType" NOT NULL DEFAULT 'NO_CLIFF',
    "cliff_duration" INTEGER NOT NULL DEFAULT 0,
    "cliff_amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "vesting_template_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Key
ALTER TABLE "vesting_template" ADD CONSTRAINT "vesting_template_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
