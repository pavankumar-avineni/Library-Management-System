/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `issueDate` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `returnedAt` on the `Issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "dueDate",
DROP COLUMN "issueDate",
DROP COLUMN "returnedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
