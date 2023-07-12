-- Update recipient_id to user_id in recipe
ALTER TABLE "recipe" DROP CONSTRAINT "recipe_recipient_id_fkey";
ALTER TABLE "recipe" DROP COLUMN "recipient_id";
ALTER TABLE "recipe" ADD COLUMN "user_id" TEXT NOT NULL;
ALTER TABLE "recipe" ADD COLUMN "address" TEXT;
ALTER TABLE "recipe" ADD COLUMN "code" TEXT NOT NULL;
ALTER TABLE "recipe" ADD COLUMN "role" "Role" NOT NULL DEFAULT E'EMPLOYEE';

CREATE UNIQUE INDEX "recipe_code_key" ON "recipe"("code");

-- Add Foreign Key
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
