PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_apps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`clerk_secret_key` text,
	`electric_url` text NOT NULL,
	`public_tables` text DEFAULT '[]' NOT NULL,
	`tenant_column_key` text NOT NULL,
	`auth` text NOT NULL,
	`jwt_id` text,
	`tenant_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_apps`("id", "name", "clerk_secret_key", "electric_url", "public_tables", "tenant_column_key", "auth", "jwt_id", "tenant_id") SELECT "id", "name", "clerk_secret_key", "electric_url", "public_tables", "tenant_column_key", "auth", "jwt_id", "tenant_id" FROM `apps`;--> statement-breakpoint
DROP TABLE `apps`;--> statement-breakpoint
ALTER TABLE `__new_apps` RENAME TO `apps`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `jwts` ADD `provider` text;