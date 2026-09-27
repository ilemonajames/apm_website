CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`details` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_events_entity` ON `audit_events` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_events_created_at` ON `audit_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`state_code` text NOT NULL,
	`lga_code` text,
	`name` text NOT NULL,
	`address` text,
	`public_phone` text,
	`public_email` text,
	`status` text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_chapters_state_lga` ON `chapters` (`state_code`,`lga_code`);--> statement-breakpoint
CREATE TABLE `content_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`body` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_content_entries_slug` ON `content_entries` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_content_entries_type_status` ON `content_entries` (`type`,`status`);--> statement-breakpoint
CREATE TABLE `leadership_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`biography` text,
	`media_asset_id` text,
	`tenure_start` integer,
	`tenure_end` integer,
	`verified_at` integer,
	`display_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`media_asset_id`) REFERENCES `media_assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_leadership_profiles_order` ON `leadership_profiles` (`display_order`);--> statement-breakpoint
CREATE TABLE `media_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`file_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`alt_text` text NOT NULL,
	`caption` text,
	`approval_status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_media_assets_object_key` ON `media_assets` (`object_key`);