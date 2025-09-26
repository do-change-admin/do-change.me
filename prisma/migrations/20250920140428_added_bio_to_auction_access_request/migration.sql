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
    "auctionAccessNumber" TEXT,
    "bio" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "AuctionAccessRequest_activeSlotId_fkey" FOREIGN KEY ("activeSlotId") REFERENCES "TimeSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuctionAccessRequest" ("activeSlotId", "agreementFileId", "applicationDate", "auctionAccessNumber", "birthDate", "driverLicenceFileId", "email", "firstName", "id", "lastName", "photoLink", "status") SELECT "activeSlotId", "agreementFileId", "applicationDate", "auctionAccessNumber", "birthDate", "driverLicenceFileId", "email", "firstName", "id", "lastName", "photoLink", "status" FROM "AuctionAccessRequest";
DROP TABLE "AuctionAccessRequest";
ALTER TABLE "new_AuctionAccessRequest" RENAME TO "AuctionAccessRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
