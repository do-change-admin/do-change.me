-- CreateTable
CREATE TABLE "MarketPriceAnalysisResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "average" INTEGER NOT NULL,
    "below" INTEGER NOT NULL,
    "above" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "distribution" JSONB NOT NULL
);
