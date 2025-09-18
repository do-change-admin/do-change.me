-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuctionAccessRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "applicationDate" DATETIME NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "photoLink" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "activeSlotId" TEXT,
    "driverLicenceId" TEXT,
    "agreementId" TEXT,
    "uploadedFileId" TEXT,
    CONSTRAINT "AuctionAccessRequest_activeSlotId_fkey" FOREIGN KEY ("activeSlotId") REFERENCES "TimeSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuctionAccessRequest_driverLicenceId_fkey" FOREIGN KEY ("driverLicenceId") REFERENCES "UploadedFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuctionAccessRequest_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "UploadedFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuctionAccessRequest_uploadedFileId_fkey" FOREIGN KEY ("uploadedFileId") REFERENCES "UploadedFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuctionAccessRequest" ("activeSlotId", "applicationDate", "birthDate", "email", "firstName", "id", "lastName", "photoLink", "status") SELECT "activeSlotId", "applicationDate", "birthDate", "email", "firstName", "id", "lastName", "photoLink", "status" FROM "AuctionAccessRequest";
DROP TABLE "AuctionAccessRequest";
ALTER TABLE "new_AuctionAccessRequest" RENAME TO "AuctionAccessRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFile_pathname_key" ON "UploadedFile"("pathname");
