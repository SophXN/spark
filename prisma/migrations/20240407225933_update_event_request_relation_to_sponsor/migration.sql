/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `EventRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Sponsor" DROP CONSTRAINT "Sponsor_eventRequestId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "EventRequest_eventId_key" ON "EventRequest"("eventId");

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
