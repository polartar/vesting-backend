
-- Add Foreign Key
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Foreign Key
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

