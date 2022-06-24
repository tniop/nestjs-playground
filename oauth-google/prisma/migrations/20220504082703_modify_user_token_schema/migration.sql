/*
  Warnings:

  - You are about to drop the column `token` on the `user_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sub_id]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_id` to the `user_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `user_tokens_token_key` ON `user_tokens`;

-- AlterTable
ALTER TABLE `user_tokens` DROP COLUMN `token`,
    ADD COLUMN `access_token` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `photo` VARCHAR(191) NOT NULL,
    ADD COLUMN `sub_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_tokens_email_key` ON `user_tokens`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `user_tokens_sub_id_key` ON `user_tokens`(`sub_id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_tokens_access_token_key` ON `user_tokens`(`access_token`);
