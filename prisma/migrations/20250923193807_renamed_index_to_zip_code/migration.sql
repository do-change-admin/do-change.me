/*
  Warnings:

  - You are about to drop the column `index` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "emailVerifiedAt" DATETIME,
    "phone" TEXT,
    "bio" TEXT,
    "address" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "auctionAccessNumber" TEXT,
    "auctionAccessQRFileId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "photoFileId" TEXT,
    "birthDate" DATETIME
);
INSERT INTO "new_User" ("address", "auctionAccessNumber", "auctionAccessQRFileId", "bio", "birthDate", "createdAt", "email", "emailVerifiedAt", "firstName", "id", "image", "lastName", "password", "phone", "photoFileId", "state", "updatedAt") SELECT "address", "auctionAccessNumber", "auctionAccessQRFileId", "bio", "birthDate", "createdAt", "email", "emailVerifiedAt", "firstName", "id", "image", "lastName", "password", "phone", "photoFileId", "state", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
