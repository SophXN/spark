/*
  Warnings:

  - You are about to drop the `_CompanyToSponsor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToSponsor" DROP CONSTRAINT "_CompanyToSponsor_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToSponsor" DROP CONSTRAINT "_CompanyToSponsor_B_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "sponsorId" TEXT;

-- DropTable
DROP TABLE "_CompanyToSponsor";

-- CreateTable
CREATE TABLE "SponsorPayments" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "squareOrderId" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorPayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorPayments" ADD CONSTRAINT "SponsorPayments_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorPayments" ADD CONSTRAINT "SponsorPayments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("squareMerchantId") ON DELETE RESTRICT ON UPDATE CASCADE;
