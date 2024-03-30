-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('FOOD', 'MUSIC', 'ART', 'DESIGN', 'SPACE', 'OTHER');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('POPUP', 'CONFERENCE', 'CONCERT', 'DINNER', 'GALA', 'FAIR', 'COMPETITION', 'CHARITY', 'NETWORKING', 'CELEBRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('ONE', 'TWO', 'THREE');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRequest" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventLocation" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL,
    "expireOn" TIMESTAMP(3) NOT NULL,
    "eventType" "EventType" NOT NULL,
    "requiresSponsor" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "EventRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "eventRequestId" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "description" TEXT NOT NULL,
    "sponsorsRequired" INTEGER NOT NULL,
    "amountPerSponsor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "eventRequestId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "description" TEXT NOT NULL,
    "collaboratorsRequired" INTEGER NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToSponsor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollaboratorToCompany" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToSponsor_AB_unique" ON "_CompanyToSponsor"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToSponsor_B_index" ON "_CompanyToSponsor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollaboratorToCompany_AB_unique" ON "_CollaboratorToCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_CollaboratorToCompany_B_index" ON "_CollaboratorToCompany"("B");

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSponsor" ADD CONSTRAINT "_CompanyToSponsor_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToSponsor" ADD CONSTRAINT "_CompanyToSponsor_B_fkey" FOREIGN KEY ("B") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaboratorToCompany" ADD CONSTRAINT "_CollaboratorToCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "Collaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaboratorToCompany" ADD CONSTRAINT "_CollaboratorToCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
