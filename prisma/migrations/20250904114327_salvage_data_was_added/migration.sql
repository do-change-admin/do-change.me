-- CreateTable
CREATE TABLE "SalvageInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vin" TEXT NOT NULL,
    "salvageWasFound" BOOLEAN NOT NULL
);
