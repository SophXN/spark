-- AlterTable
ALTER TABLE "PaymentLink" ADD COLUMN     "payeeMerchantId" TEXT;

-- AddForeignKey
ALTER TABLE "PaymentLink" ADD CONSTRAINT "PaymentLink_payeeMerchantId_fkey" FOREIGN KEY ("payeeMerchantId") REFERENCES "Company"("squareMerchantId") ON DELETE SET NULL ON UPDATE CASCADE;
