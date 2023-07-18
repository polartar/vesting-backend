ALTER TABLE "recipe" ADD COLUMN "email" TEXT;

UPDATE "recipe" SET "email" = "user"."email" FROM "user" WHERE "recipe"."user_id" = "user"."id";

-- Drop the foreign key constraint on `Recipe.userId`
ALTER TABLE "recipe" DROP CONSTRAINT "recipe_user_id_fkey";

-- Remove the `userId` column from `Recipe`
ALTER TABLE "recipe" DROP COLUMN "user_id";
