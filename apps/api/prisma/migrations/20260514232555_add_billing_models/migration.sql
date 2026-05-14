-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('PLAN', 'ADDON');

-- AlterTable
ALTER TABLE "global_settings" ADD COLUMN     "quarterly_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "yearly_discount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "addon_id" TEXT,
ADD COLUMN     "billing_cycle" "BillingCycle",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" "InvoiceType" NOT NULL DEFAULT 'PLAN';

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "is_free" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paystack_plan_code_monthly" TEXT,
ADD COLUMN     "paystack_plan_code_quarterly" TEXT,
ADD COLUMN     "paystack_plan_code_yearly" TEXT,
ADD COLUMN     "trial_days" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "trial_enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "quarterly_discount" DROP NOT NULL,
ALTER COLUMN "quarterly_discount" DROP DEFAULT,
ALTER COLUMN "yearly_discount" DROP NOT NULL,
ALTER COLUMN "yearly_discount" DROP DEFAULT;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "authorization_code" TEXT,
ADD COLUMN     "billing_cycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "paystack_customer_code" TEXT,
ADD COLUMN     "trial_ends_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "authorization_code" TEXT NOT NULL,
    "card_type" TEXT,
    "last4" TEXT,
    "exp_month" TEXT,
    "exp_year" TEXT,
    "bank" TEXT,
    "country_code" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_authorization_code_key" ON "payment_methods"("authorization_code");

-- CreateIndex
CREATE INDEX "payment_methods_organization_id_idx" ON "payment_methods"("organization_id");

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
