CREATE TABLE `apps` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`clerk_secret_key` text NOT NULL,
	`clerk_publishable_key` text NOT NULL,
	`electric_url` text NOT NULL
);
