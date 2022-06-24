/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `family_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `given_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `name`,
    ADD COLUMN `family_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `given_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `photo` VARCHAR(191) NOT NULL;
