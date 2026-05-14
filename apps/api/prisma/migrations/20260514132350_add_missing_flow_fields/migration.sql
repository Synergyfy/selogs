-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "enable_notes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enable_phone_number" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ocr_enabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otp_code" TEXT,
ADD COLUMN     "otp_expiry" TIMESTAMP(3),
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_expiry" TIMESTAMP(3);
