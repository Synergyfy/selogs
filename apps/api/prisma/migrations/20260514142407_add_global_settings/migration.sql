-- CreateTable
CREATE TABLE "global_settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "platform_name" TEXT NOT NULL DEFAULT 'VGuard',
    "contact_email" TEXT,
    "support_phone" TEXT,
    "allow_new_signups" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);
