/*
  Warnings:

  - You are about to drop the column `expireOn` on the `EventRequest` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `EventRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requiresSponsor` on the `EventRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventRequest" DROP COLUMN "expireOn",
DROP COLUMN "isActive",
DROP COLUMN "requiresSponsor";
