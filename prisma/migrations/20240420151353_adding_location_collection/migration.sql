/*
  Warnings:

  - You are about to drop the column `businessCityLocation` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `businessStoreType` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `merchantCodes` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "businessCityLocation",
DROP COLUMN "businessStoreType",
DROP COLUMN "merchantCodes";

-- CreateTable
CREATE TABLE "MerchantLocation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "squareLocationId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "merchantCode" TEXT NOT NULL,

    CONSTRAINT "MerchantLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MerchantLocation" ADD CONSTRAINT "MerchantLocation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
