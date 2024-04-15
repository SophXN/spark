/*
  Warnings:

  - You are about to drop the column `isAccepted` on the `CollaboratorResponse` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CollaboratorResponseStatus" AS ENUM ('ACCEPTED', 'PENDING', 'DENIED');

-- AlterTable
ALTER TABLE "CollaboratorResponse" DROP COLUMN "isAccepted",
ADD COLUMN     "status" "CollaboratorResponseStatus" NOT NULL DEFAULT 'PENDING';
