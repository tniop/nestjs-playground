-- DropIndex
DROP INDEX `user_tokens_id_token_key` ON `user_tokens`;

-- AlterTable
ALTER TABLE `user_tokens` MODIFY `id_token` TEXT NOT NULL;
