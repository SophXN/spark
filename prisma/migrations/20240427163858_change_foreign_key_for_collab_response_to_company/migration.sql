-- DropForeignKey
ALTER TABLE "CollaboratorResponse" DROP CONSTRAINT "CollaboratorResponse_responderId_fkey";

-- AddForeignKey
ALTER TABLE "CollaboratorResponse" ADD CONSTRAINT "CollaboratorResponse_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "Company"("squareMerchantId") ON DELETE RESTRICT ON UPDATE CASCADE;
