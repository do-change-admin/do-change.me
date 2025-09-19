/*
  Warnings:

  - You are about to drop the `UploadedFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `agreementId` on the `AuctionAccessRequest` table. All the data in the column will be lost.
  - You are about to drop the column `driverLicenceId` on the `AuctionAccessRequest` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedFileId` on the `AuctionAccessRequest` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UploadedFile_pathname_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UploadedFile";
PRAGMA foreign_keys=on;

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
    "driverLicenceFileId" TEXT,
    "agreementFileId" TEXT,
    CONSTRAINT "AuctionAccessRequest_activeSlotId_fkey" FOREIGN KEY ("activeSlotId") REFERENCES "TimeSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuctionAccessRequest" ("activeSlotId", "applicationDate", "birthDate", "email", "firstName", "id", "lastName", "photoLink", "status") SELECT "activeSlotId", "applicationDate", "birthDate", "email", "firstName", "id", "lastName", "photoLink", "status" FROM "AuctionAccessRequest";
DROP TABLE "AuctionAccessRequest";
ALTER TABLE "new_AuctionAccessRequest" RENAME TO "AuctionAccessRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
