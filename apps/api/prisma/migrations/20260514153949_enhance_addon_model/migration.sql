-- AlterTable
ALTER TABLE "addons" ADD COLUMN     "branch_limit_inc" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "custom_features" TEXT[],
ADD COLUMN     "device_limit_inc" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "staff_limit_inc" INTEGER NOT NULL DEFAULT 0;
