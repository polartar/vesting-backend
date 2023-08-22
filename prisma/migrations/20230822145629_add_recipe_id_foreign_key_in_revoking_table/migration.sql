
-- Add Foreign Key
ALTER TABLE "revoking" ADD CONSTRAINT "revoking_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
