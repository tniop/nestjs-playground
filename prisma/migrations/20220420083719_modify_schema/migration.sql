-- DropIndex
DROP INDEX `posts_author_id_fkey` ON `posts`;

-- DropIndex
DROP INDEX `posts_id_key` ON `posts`;

-- DropIndex
DROP INDEX `users_id_key` ON `users`;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
