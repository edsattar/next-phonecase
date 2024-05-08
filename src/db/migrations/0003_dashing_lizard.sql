CREATE TABLE `configurationsa` (
	`id` text PRIMARY KEY NOT NULL,
	`image_url` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`cropped_image_url` text
);
--> statement-breakpoint
DROP TABLE `configurations`;