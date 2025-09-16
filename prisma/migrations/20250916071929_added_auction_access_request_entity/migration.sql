-- CreateTable
CREATE TABLE "AuctionAccessRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "applicationDate" DATETIME NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "photoLink" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
