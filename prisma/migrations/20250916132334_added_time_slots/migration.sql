-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "auctionAccessRequestId" TEXT NOT NULL,
    CONSTRAINT "TimeSlot_auctionAccessRequestId_fkey" FOREIGN KEY ("auctionAccessRequestId") REFERENCES "AuctionAccessRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    CONSTRAINT "AuctionAccessRequest_activeSlotId_fkey" FOREIGN KEY ("activeSlotId") REFERENCES "TimeSlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuctionAccessRequest" ("applicationDate", "birthDate", "email", "firstName", "id", "lastName", "photoLink", "status") SELECT "applicationDate", "birthDate", "email", "firstName", "id", "lastName", "photoLink", "status" FROM "AuctionAccessRequest";
DROP TABLE "AuctionAccessRequest";
ALTER TABLE "new_AuctionAccessRequest" RENAME TO "AuctionAccessRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
