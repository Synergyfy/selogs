-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "primary_color" TEXT DEFAULT '#3B82F6',
ADD COLUMN     "secondary_color" TEXT DEFAULT '#1E293B';
