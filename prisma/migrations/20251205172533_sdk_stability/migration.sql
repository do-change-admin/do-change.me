-- CreateTable
CREATE TABLE "public"."UserSyndicationRequest" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "mainPhotoId" TEXT NOT NULL,
    "additionalPhotoIds" TEXT[],
    "marketplaceLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSyndicationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSyndicationRequestDraft" (
    "id" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "vin" TEXT,
    "mileage" INTEGER,
    "price" INTEGER,
    "year" INTEGER,
    "mainPhotoId" TEXT,
    "additionalPhotoIds" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSyndicationRequestDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSyndicationRequest_model_make_idx" ON "public"."UserSyndicationRequest"("model", "make");

-- CreateIndex
CREATE INDEX "UserSyndicationRequestDraft_model_make_idx" ON "public"."UserSyndicationRequestDraft"("model", "make");

-- AddForeignKey
ALTER TABLE "public"."UserSyndicationRequest" ADD CONSTRAINT "UserSyndicationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSyndicationRequestDraft" ADD CONSTRAINT "UserSyndicationRequestDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
