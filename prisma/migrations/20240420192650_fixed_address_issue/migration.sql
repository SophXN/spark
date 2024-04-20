/*
  Warnings:

  - You are about to drop the column `address` on the `Account` table. All the data in the column will be lost.
  - Added the required column `address` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT NOT NULL;
