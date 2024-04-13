-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_eventRequestId_fkey";

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
