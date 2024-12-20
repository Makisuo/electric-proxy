CREATE TABLE `apps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`clerk_secret_key` text NOT NULL,
	`clerk_publishable_key` text NOT NULL,
	`electric_url` text NOT NULL,
	`public_tables` text DEFAULT '[]' NOT NULL,
	`tenant_column_key` text NOT NULL,
	`auth` text NOT NULL,
	`tenant_id` text NOT NULL
);
