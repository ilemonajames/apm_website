import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
export const contentEntries = sqliteTable("content_entries", { id: text("id").primaryKey(), type: text("type", { enum: ["page", "news", "event", "policy"] }).notNull(), slug: text("slug").notNull(), title: text("title").notNull(), summary: text("summary"), body: text("body").notNull(), status: text("status", { enum: ["draft", "review", "published", "archived"] }).notNull().default("draft"), publishedAt: integer("published_at", { mode: "timestamp" }), createdAt: integer("created_at", { mode: "timestamp" }).notNull(), updatedAt: integer("updated_at", { mode: "timestamp" }).notNull() }, (table) => [uniqueIndex("idx_content_entries_slug").on(table.slug), index("idx_content_entries_type_status").on(table.type, table.status)]);
export const mediaAssets = sqliteTable("media_assets", { id: text("id").primaryKey(), objectKey: text("object_key").notNull(), fileName: text("file_name").notNull(), mimeType: text("mime_type").notNull(), altText: text("alt_text").notNull(), caption: text("caption"), approvalStatus: text("approval_status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"), createdAt: integer("created_at", { mode: "timestamp" }).notNull() }, (table) => [uniqueIndex("idx_media_assets_object_key").on(table.objectKey)]);
export const leadershipProfiles = sqliteTable("leadership_profiles", { id: text("id").primaryKey(), name: text("name").notNull(), role: text("role").notNull(), biography: text("biography"), mediaAssetId: text("media_asset_id").references(() => mediaAssets.id), tenureStart: integer("tenure_start", { mode: "timestamp" }), tenureEnd: integer("tenure_end", { mode: "timestamp" }), verifiedAt: integer("verified_at", { mode: "timestamp" }), displayOrder: integer("display_order").notNull().default(0) }, (table) => [index("idx_leadership_profiles_order").on(table.displayOrder)]);
export const chapters = sqliteTable("chapters", { id: text("id").primaryKey(), stateCode: text("state_code").notNull(), lgaCode: text("lga_code"), name: text("name").notNull(), address: text("address"), publicPhone: text("public_phone"), publicEmail: text("public_email"), status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("draft") }, (table) => [index("idx_chapters_state_lga").on(table.stateCode, table.lgaCode)]);
export const auditEvents = sqliteTable("audit_events", { id: text("id").primaryKey(), actorId: text("actor_id").notNull(), action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id").notNull(), details: text("details"), createdAt: integer("created_at", { mode: "timestamp" }).notNull() }, (table) => [index("idx_audit_events_entity").on(table.entityType, table.entityId), index("idx_audit_events_created_at").on(table.createdAt)]);

export const members = sqliteTable("members", {
  id: text("id").primaryKey(),
  membershipReference: text("membership_reference").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  stateCode: text("state_code"),
  lgaName: text("lga_name"),
  wardName: text("ward_name"),
  status: text("status", { enum: ["pending_email", "pending_review", "approved", "rejected", "suspended"] }).notNull().default("pending_email"),
  emailVerifiedAt: integer("email_verified_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => [uniqueIndex("idx_members_reference").on(table.membershipReference), uniqueIndex("idx_members_email").on(table.email), index("idx_members_status").on(table.status)]);

export const memberAccessCodes = sqliteTable("member_access_codes", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull().references(() => members.id),
  purpose: text("purpose", { enum: ["verify_email", "sign_in"] }).notNull(),
  codeHash: text("code_hash").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp" }),
  attemptCount: integer("attempt_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [index("idx_access_codes_member_purpose").on(table.memberId, table.purpose), index("idx_access_codes_expiry").on(table.expiresAt)]);

export const memberSessions = sqliteTable("member_sessions", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull().references(() => members.id),
  tokenHash: text("token_hash").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }).notNull(),
}, (table) => [uniqueIndex("idx_member_sessions_token").on(table.tokenHash), index("idx_member_sessions_member").on(table.memberId), index("idx_member_sessions_expiry").on(table.expiresAt)]);

export const membershipStatusHistory = sqliteTable("membership_status_history", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull().references(() => members.id),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  reason: text("reason"),
  actorId: text("actor_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [index("idx_membership_history_member").on(table.memberId, table.createdAt)]);

export const elections = sqliteTable("elections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  electionDate: integer("election_date", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["draft", "open", "closed", "archived"] }).notNull().default("draft"),
  applicationDeadline: integer("application_deadline", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [index("idx_elections_status_date").on(table.status, table.electionDate)]);

export const inecLocations = sqliteTable("inec_locations", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  type: text("type", { enum: ["state", "lga", "ward", "polling_unit"] }).notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  parentId: text("parent_id"),
  retrievedAt: integer("retrieved_at", { mode: "timestamp" }).notNull(),
}, (table) => [uniqueIndex("idx_inec_locations_source").on(table.sourceId), index("idx_inec_locations_parent_type").on(table.parentId, table.type), index("idx_inec_locations_code").on(table.code)]);

export const pollingAgentApplications = sqliteTable("polling_agent_applications", {
  id: text("id").primaryKey(),
  applicationReference: text("application_reference").notNull(),
  memberId: text("member_id").notNull().references(() => members.id),
  electionId: text("election_id").notNull().references(() => elections.id),
  pollingUnitId: text("polling_unit_id").notNull().references(() => inecLocations.id),
  status: text("status", { enum: ["submitted", "under_review", "correction_required", "approved", "rejected", "withdrawn"] }).notNull().default("submitted"),
  experience: text("experience"),
  availabilityConfirmed: integer("availability_confirmed", { mode: "boolean" }).notNull().default(false),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
}, (table) => [uniqueIndex("idx_agent_applications_reference").on(table.applicationReference), uniqueIndex("idx_agent_applications_member_election").on(table.memberId, table.electionId), index("idx_agent_applications_status").on(table.status)]);

export const pollingAgentDecisions = sqliteTable("polling_agent_decisions", {
  id: text("id").primaryKey(),
  applicationId: text("application_id").notNull().references(() => pollingAgentApplications.id),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  reason: text("reason"),
  reviewerId: text("reviewer_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [index("idx_agent_decisions_application").on(table.applicationId, table.createdAt)]);
