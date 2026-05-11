-- Drop onboarding flag and make username required + unique
DELETE FROM "user" WHERE "username" IS NULL;

ALTER TABLE "user" DROP COLUMN "onboarded";
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;
