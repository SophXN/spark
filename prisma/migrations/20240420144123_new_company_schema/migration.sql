/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.
  - Added the required column `businessDescription` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facebookUrl` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instagramUrl` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `squareLocationId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `squareMerchantId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitterUrl` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
DROP COLUMN "industry",
ADD COLUMN     "businessCityLocation" TEXT[],
ADD COLUMN     "businessDescription" TEXT NOT NULL,
ADD COLUMN     "businessStoreType" TEXT[],
ADD COLUMN     "facebookUrl" TEXT NOT NULL,
ADD COLUMN     "instagramUrl" TEXT NOT NULL,
ADD COLUMN     "merchantCodes" TEXT[],
ADD COLUMN     "squareLocationId" TEXT NOT NULL,
ADD COLUMN     "squareMerchantId" TEXT NOT NULL,
ADD COLUMN     "twitterUrl" TEXT NOT NULL;
