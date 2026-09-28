CREATE TABLE `elections` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`election_date` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`application_deadline` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_elections_status_date` ON `elections` (`status`,`election_date`);--> statement-breakpoint
CREATE TABLE `inec_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`type` text NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`parent_id` text,
	`retrieved_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_inec_locations_source` ON `inec_locations` (`source_id`);--> statement-breakpoint
CREATE INDEX `idx_inec_locations_parent_type` ON `inec_locations` (`parent_id`,`type`);--> statement-breakpoint
CREATE INDEX `idx_inec_locations_code` ON `inec_locations` (`code`);--> statement-breakpoint
CREATE TABLE `member_access_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`purpose` text NOT NULL,
	`code_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`attempt_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_access_codes_member_purpose` ON `member_access_codes` (`member_id`,`purpose`);--> statement-breakpoint
CREATE INDEX `idx_access_codes_expiry` ON `member_access_codes` (`expires_at`);--> statement-breakpoint
CREATE TABLE `member_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`last_used_at` integer NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_member_sessions_token` ON `member_sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_member_sessions_member` ON `member_sessions` (`member_id`);--> statement-breakpoint
CREATE INDEX `idx_member_sessions_expiry` ON `member_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`membership_reference` text NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`middle_name` text,
	`last_name` text NOT NULL,
	`phone` text NOT NULL,
	`state_code` text,
	`lga_name` text,
	`ward_name` text,
	`status` text DEFAULT 'pending_email' NOT NULL,
	`email_verified_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_members_reference` ON `members` (`membership_reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_members_email` ON `members` (`email`);--> statement-breakpoint
CREATE INDEX `idx_members_status` ON `members` (`status`);--> statement-breakpoint
CREATE TABLE `membership_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`reason` text,
	`actor_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_membership_history_member` ON `membership_status_history` (`member_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `polling_agent_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`application_reference` text NOT NULL,
	`member_id` text NOT NULL,
	`election_id` text NOT NULL,
	`polling_unit_id` text NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`experience` text,
	`availability_confirmed` integer DEFAULT false NOT NULL,
	`submitted_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`election_id`) REFERENCES `elections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`polling_unit_id`) REFERENCES `inec_locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_agent_applications_reference` ON `polling_agent_applications` (`application_reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_agent_applications_member_election` ON `polling_agent_applications` (`member_id`,`election_id`);--> statement-breakpoint
CREATE INDEX `idx_agent_applications_status` ON `polling_agent_applications` (`status`);--> statement-breakpoint
CREATE TABLE `polling_agent_decisions` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`reason` text,
	`reviewer_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `polling_agent_applications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_agent_decisions_application` ON `polling_agent_decisions` (`application_id`,`created_at`);