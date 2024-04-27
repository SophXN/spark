/*
  Warnings:

  - You are about to drop the column `sponsorId` on the `Company` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_sponsorId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "sponsorId";
