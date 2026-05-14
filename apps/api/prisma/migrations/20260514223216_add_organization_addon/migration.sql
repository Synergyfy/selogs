-- AlterTable
ALTER TABLE "addons" ADD COLUMN     "grants_analytics" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "grants_export" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "grants_ocr" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "organization_addons" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "addon_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "organization_addons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organization_addons_organization_id_idx" ON "organization_addons"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_addons_organization_id_addon_id_key" ON "organization_addons"("organization_id", "addon_id");

-- AddForeignKey
ALTER TABLE "organization_addons" ADD CONSTRAINT "organization_addons_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_addons" ADD CONSTRAINT "organization_addons_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
