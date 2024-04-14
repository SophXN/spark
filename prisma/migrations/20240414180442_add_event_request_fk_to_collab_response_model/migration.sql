/*
  Warnings:

  - Added the required column `eventRequestId` to the `CollaboratorResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollaboratorResponse" ADD COLUMN     "eventRequestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CollaboratorResponse" ADD CONSTRAINT "CollaboratorResponse_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
