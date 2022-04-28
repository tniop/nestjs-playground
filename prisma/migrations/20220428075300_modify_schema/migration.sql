/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `password`,
    ADD COLUMN `access_token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_access_token_key` ON `users`(`access_token`);
