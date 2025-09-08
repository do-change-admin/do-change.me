-- CreateTable
CREATE TABLE "CarReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL
);
