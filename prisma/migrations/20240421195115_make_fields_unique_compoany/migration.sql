/*
  Warnings:

  - A unique constraint covering the columns `[squareMerchantId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[squareLocationId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Company_squareMerchantId_key" ON "Company"("squareMerchantId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_squareLocationId_key" ON "Company"("squareLocationId");
