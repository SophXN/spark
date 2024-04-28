/*
  Warnings:

  - The `paymentLink` column on the `Sponsor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Sponsor" DROP COLUMN "paymentLink",
ADD COLUMN     "paymentLink" TEXT[];
