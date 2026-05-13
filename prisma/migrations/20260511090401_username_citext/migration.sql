-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" SET DATA TYPE CITEXT;
