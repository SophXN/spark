/*
  Warnings:

  - You are about to drop the `_CollaboratorToCompany` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CollaboratorToCompany" DROP CONSTRAINT "_CollaboratorToCompany_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollaboratorToCompany" DROP CONSTRAINT "_CollaboratorToCompany_B_fkey";

-- DropTable
DROP TABLE "_CollaboratorToCompany";

-- CreateTable
CREATE TABLE "CollaboratorResponse" (
    "id" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "responderId" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL,
    "responseMessage" TEXT,
    "respondedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollaboratorResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollaboratorResponse" ADD CONSTRAINT "CollaboratorResponse_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorResponse" ADD CONSTRAINT "CollaboratorResponse_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
