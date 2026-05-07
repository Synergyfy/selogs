-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "plan_id" TEXT;

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthly_price" DOUBLE PRECISION NOT NULL,
    "quarterly_price" DOUBLE PRECISION,
    "yearly_price" DOUBLE PRECISION,
    "quarterly_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yearly_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "branch_limit" INTEGER NOT NULL DEFAULT 1,
    "staff_limit" INTEGER NOT NULL DEFAULT 5,
    "device_limit" INTEGER NOT NULL DEFAULT 2,
    "has_ocr" BOOLEAN NOT NULL DEFAULT false,
    "has_analytics" BOOLEAN NOT NULL DEFAULT false,
    "has_export" BOOLEAN NOT NULL DEFAULT false,
    "custom_features" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
