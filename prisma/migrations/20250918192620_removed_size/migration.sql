/*
  Warnings:

  - You are about to drop the column `size` on the `UploadedFile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UploadedFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL
);
INSERT INTO "new_UploadedFile" ("contentType", "filename", "id", "pathname", "uploadedAt", "url") SELECT "contentType", "filename", "id", "pathname", "uploadedAt", "url" FROM "UploadedFile";
DROP TABLE "UploadedFile";
ALTER TABLE "new_UploadedFile" RENAME TO "UploadedFile";
CREATE UNIQUE INDEX "UploadedFile_pathname_key" ON "UploadedFile"("pathname");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
