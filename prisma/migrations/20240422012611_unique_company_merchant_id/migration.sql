/*
  Warnings:

  - A unique constraint covering the columns `[squareMerchantId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EventRequest" DROP CONSTRAINT "EventRequest_requesterId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Company_squareMerchantId_key" ON "Company"("squareMerchantId");

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Company"("squareMerchantId") ON DELETE RESTRICT ON UPDATE CASCADE;
