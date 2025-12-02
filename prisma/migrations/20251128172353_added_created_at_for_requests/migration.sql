-- AlterTable: SyndicationRequestDrafts
ALTER TABLE "public"."SyndicationRequestDrafts"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Fill updatedAt for existing rows
UPDATE "public"."SyndicationRequestDrafts"
SET "updatedAt" = CURRENT_TIMESTAMP
WHERE "updatedAt" IS NULL;

-- Make updatedAt required
ALTER TABLE "public"."SyndicationRequestDrafts"
ALTER COLUMN "updatedAt" SET NOT NULL;


-- AlterTable: SyndicationRequests
ALTER TABLE "public"."SyndicationRequests"
ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Fill updatedAt for existing rows
UPDATE "public"."SyndicationRequests"
SET "updatedAt" = CURRENT_TIMESTAMP
WHERE "updatedAt" IS NULL;

-- Make updatedAt required
ALTER TABLE "public"."SyndicationRequests"
ALTER COLUMN "updatedAt" SET NOT NULL;