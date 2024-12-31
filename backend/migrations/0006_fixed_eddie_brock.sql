PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_jwts` (
	`id` text PRIMARY KEY NOT NULL,
	`alg` text,
	`public_key` text,
	`public_key_remote` text,
	`provider` text
);
--> statement-breakpoint
INSERT INTO `__new_jwts`("id", "alg", "public_key", "public_key_remote", "provider") SELECT "id", "alg", "public_key", "public_key_remote", "provider" FROM `jwts`;--> statement-breakpoint
DROP TABLE `jwts`;--> statement-breakpoint
ALTER TABLE `__new_jwts` RENAME TO `jwts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;