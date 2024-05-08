CREATE TABLE `configurations` (
	`id` text PRIMARY KEY NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`cropped_image_url` text
);
--> statement-breakpoint
DROP TABLE `users`;