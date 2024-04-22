/*
  Warnings:

  - You are about to drop the column `squareLocationId` on the `Company` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventRequest" DROP CONSTRAINT "EventRequest_requesterId_fkey";

-- DropIndex
DROP INDEX "Company_squareLocationId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "squareLocationId";

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Company"("squareMerchantId") ON DELETE RESTRICT ON UPDATE CASCADE;
