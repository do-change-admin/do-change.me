/*
  Warnings:

  - You are about to drop the `StripeWebhookEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `currentPeriodEnd` on the `StripeSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `StripeSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `StripeSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `StripeSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `StripeSubscription` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `StripeSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "StripeWebhookEvent_stripeEventId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StripeWebhookEvent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "StripeSubscriptionItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripeItemId" TEXT NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "priceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currentPeriodStart" DATETIME NOT NULL,
    "currentPeriodEnd" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StripeSubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "StripeSubscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StripeSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripeSubscriptionId" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" DATETIME,
    "trialEnd" DATETIME,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StripeSubscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "StripeCustomer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StripeSubscription" ("cancelAtPeriodEnd", "canceledAt", "createdAt", "id", "metadata", "status", "stripeSubscriptionId", "trialEnd", "updatedAt") SELECT "cancelAtPeriodEnd", "canceledAt", "createdAt", "id", "metadata", "status", "stripeSubscriptionId", "trialEnd", "updatedAt" FROM "StripeSubscription";
DROP TABLE "StripeSubscription";
ALTER TABLE "new_StripeSubscription" RENAME TO "StripeSubscription";
CREATE UNIQUE INDEX "StripeSubscription_stripeSubscriptionId_key" ON "StripeSubscription"("stripeSubscriptionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscriptionItem_stripeItemId_key" ON "StripeSubscriptionItem"("stripeItemId");
