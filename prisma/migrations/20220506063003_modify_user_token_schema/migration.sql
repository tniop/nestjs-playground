/*
  Warnings:

  - You are about to drop the column `access_token` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `sub_id` on the `user_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_token]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_token` to the `user_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `user_tokens_access_token_key` ON `user_tokens`;

-- DropIndex
DROP INDEX `user_tokens_sub_id_key` ON `user_tokens`;

-- AlterTable
ALTER TABLE `user_tokens` DROP COLUMN `access_token`,
    DROP COLUMN `sub_id`,
    ADD COLUMN `id_token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_tokens_id_token_key` ON `user_tokens`(`id_token`);
