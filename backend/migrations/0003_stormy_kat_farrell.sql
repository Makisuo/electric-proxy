CREATE TABLE `jwts` (
	`id` text PRIMARY KEY NOT NULL,
	`alg` text NOT NULL,
	`public_key` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jwks` (
	`id` text PRIMARY KEY NOT NULL,
	`public_key` text NOT NULL,
	`private_key` text NOT NULL,
	`created_at` integer NOT NULL
);
