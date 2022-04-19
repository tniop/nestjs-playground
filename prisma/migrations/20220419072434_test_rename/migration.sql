/*
  Warnings:

  - Made the column `author_id` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_author_id_fkey`;

-- AlterTable
ALTER TABLE `posts` MODIFY `author_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `posts` RENAME INDEX `Post_id_key` TO `posts_id_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `User_email_key` TO `users_email_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `User_id_key` TO `users_id_key`;
