/*
  Warnings:

  - You are about to drop the column `orderId` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `paymentLink` on the `Sponsor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sponsor" DROP COLUMN "orderId",
DROP COLUMN "paymentLink";

-- CreateTable
CREATE TABLE "PaymentLink" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "paymentLink" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "squareOrderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentLink" ADD CONSTRAINT "PaymentLink_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
