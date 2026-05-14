-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "vehicle_entries" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "vehicle_entries_organization_id_deleted_at_idx" ON "vehicle_entries"("organization_id", "deleted_at");

-- CreateIndex
CREATE INDEX "vehicle_entries_branch_id_check_in_time_idx" ON "vehicle_entries"("branch_id", "check_in_time");
