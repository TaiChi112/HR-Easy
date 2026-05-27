/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "discordId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_discordId_key" ON "Employee"("discordId");
