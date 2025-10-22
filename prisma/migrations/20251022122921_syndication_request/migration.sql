-- CreateTable
CREATE TABLE "public"."SyndicationRequestDrafts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vin" TEXT,
    "make" TEXT,
    "model" TEXT,
    "mileage" INTEGER,
    "price" INTEGER,
    "year" INTEGER,
    "photoIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "SyndicationRequestDrafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SyndicationRequests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "photoIds" TEXT[],
    "marketplaceLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "SyndicationRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SyndicationRequestDrafts_model_make_idx" ON "public"."SyndicationRequestDrafts"("model", "make");

-- CreateIndex
CREATE INDEX "SyndicationRequests_model_make_idx" ON "public"."SyndicationRequests"("model", "make");

-- AddForeignKey
ALTER TABLE "public"."SyndicationRequestDrafts" ADD CONSTRAINT "SyndicationRequestDrafts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SyndicationRequests" ADD CONSTRAINT "SyndicationRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
