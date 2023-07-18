ALTER TABLE "recipe" ADD COLUMN "name" TEXT;

UPDATE "recipe" SET "name" = "user"."name" FROM "user" WHERE "recipe"."email" = "user"."email";
