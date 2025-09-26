-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripeProductId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reportsCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Plan" ("active", "createdAt", "description", "id", "name", "slug", "stripeProductId", "updatedAt") SELECT "active", "createdAt", "description", "id", "name", "slug", "stripeProductId", "updatedAt" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE UNIQUE INDEX "Plan_stripeProductId_key" ON "Plan"("stripeProductId");
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
