/**
 * BRANDING OS - Drizzle ORM Schema
 *
 * Este arquivo define o schema do banco de dados usando Drizzle ORM.
 * Compatível com PostgreSQL (produção) e SQLite (desenvolvimento/MVP).
 *
 * @version 1.0.0
 * @author DB Sage v2 + AIOS Orchestrator
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  decimal,
  jsonb,
  date,
  pgEnum,
  uniqueIndex,
  index,
  real,
  bigint,
  inet,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const campaignStatusEnum = pgEnum('campaign_status', [
  'draft',
  'active',
  'paused',
  'completed',
  'archived',
]);

export const assetTypeEnum = pgEnum('asset_type', [
  'post',
  'story',
  'carousel',
  'banner',
  'ad',
  'slide',
]);

export const platformTypeEnum = pgEnum('platform_type', [
  'instagram',
  'linkedin',
  'facebook',
  'twitter',
  'tiktok',
  'youtube',
  'generic',
]);

export const templateTypeEnum = pgEnum('template_type', [
  'copy',
  'layout',
  'full',
]);

export const userRoleEnum = pgEnum('user_role', [
  'owner',
  'editor',
  'viewer',
]);

export const validationSeverityEnum = pgEnum('validation_severity', [
  'error',
  'warning',
  'info',
]);

export const generationStatusEnum = pgEnum('generation_status', [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
]);

// ============================================================================
// TABLES
// ============================================================================

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  emailVerifiedAt: timestamp('email_verified_at'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex('idx_users_email').on(table.email),
}));

// Brands
export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  isActive: boolean('is_active').default(true),
  brandConfig: jsonb('brand_config').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_brands_user_id').on(table.userId),
  slugIdx: uniqueIndex('idx_brands_slug').on(table.slug),
}));

// Brand Members (Multi-tenant access)
export const brandMembers = pgTable('brand_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').notNull().default('viewer'),
  invitedBy: uuid('invited_by').references(() => users.id),
  invitedAt: timestamp('invited_at').defaultNow(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  brandUserUnique: uniqueIndex('idx_brand_members_unique').on(table.brandId, table.userId),
  brandIdIdx: index('idx_brand_members_brand_id').on(table.brandId),
  userIdIdx: index('idx_brand_members_user_id').on(table.userId),
}));

// Products
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  features: jsonb('features').default([]),
  benefits: jsonb('benefits').default([]),
  price: decimal('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('BRL'),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdIdx: index('idx_products_brand_id').on(table.brandId),
}));

// Campaigns
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  objective: text('objective'),
  targetAudience: text('target_audience'),
  keyMessages: jsonb('key_messages').default([]),
  startDate: date('start_date'),
  endDate: date('end_date'),
  status: campaignStatusEnum('status').default('draft'),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('BRL'),
  tags: jsonb('tags').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdIdx: index('idx_campaigns_brand_id').on(table.brandId),
  statusIdx: index('idx_campaigns_status').on(table.status),
}));

// Templates
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: templateTypeEnum('type').notNull(),
  category: varchar('category', { length: 100 }),
  dimensions: jsonb('dimensions'),
  platform: platformTypeEnum('platform'),
  assetType: assetTypeEnum('asset_type'),
  layoutSpec: jsonb('layout_spec').notNull().default({}),
  copyStructure: jsonb('copy_structure').default({}),
  variables: jsonb('variables').default([]),
  thumbnailUrl: text('thumbnail_url'),
  isPublic: boolean('is_public').default(false),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdIdx: index('idx_templates_brand_id').on(table.brandId),
  typeIdx: index('idx_templates_type').on(table.type),
  platformIdx: index('idx_templates_platform').on(table.platform),
}));

// Assets
export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'set null' }),
  templateId: uuid('template_id').references(() => templates.id, { onDelete: 'set null' }),
  type: assetTypeEnum('type').notNull(),
  platform: platformTypeEnum('platform').notNull().default('generic'),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  fileSize: integer('file_size'),
  format: varchar('format', { length: 10 }),
  dimensions: jsonb('dimensions'),
  content: jsonb('content').default({}),
  generationContext: jsonb('generation_context').default({}),
  qualityScore: real('quality_score'),
  validationResult: jsonb('validation_result').default({}),
  status: generationStatusEnum('status').default('completed'),
  isFavorite: boolean('is_favorite').default(false),
  isArchived: boolean('is_archived').default(false),
  tags: jsonb('tags').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdIdx: index('idx_assets_brand_id').on(table.brandId),
  campaignIdIdx: index('idx_assets_campaign_id').on(table.campaignId),
  templateIdIdx: index('idx_assets_template_id').on(table.templateId),
  typeIdx: index('idx_assets_type').on(table.type),
  platformIdx: index('idx_assets_platform').on(table.platform),
  statusIdx: index('idx_assets_status').on(table.status),
  createdAtIdx: index('idx_assets_created_at').on(table.createdAt),
  brandCreatedIdx: index('idx_assets_brand_created').on(table.brandId, table.createdAt),
}));

// Generation Jobs
export const generationJobs = pgTable('generation_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'set null' }),
  templateId: uuid('template_id').references(() => templates.id, { onDelete: 'set null' }),
  userRequest: text('user_request').notNull(),
  assetType: assetTypeEnum('asset_type'),
  platform: platformTypeEnum('platform'),
  status: generationStatusEnum('status').default('pending'),
  progress: integer('progress').default(0),
  currentAgent: varchar('current_agent', { length: 50 }),
  assetId: uuid('asset_id').references(() => assets.id, { onDelete: 'set null' }),
  errorMessage: text('error_message'),
  errorDetails: jsonb('error_details'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  durationMs: integer('duration_ms'),
  agentLogs: jsonb('agent_logs').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdIdx: index('idx_generation_jobs_brand_id').on(table.brandId),
  statusIdx: index('idx_generation_jobs_status').on(table.status),
  createdAtIdx: index('idx_generation_jobs_created_at').on(table.createdAt),
}));

// Validation Rules
export const validationRules = pgTable('validation_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  severity: validationSeverityEnum('severity').notNull().default('warning'),
  ruleType: varchar('rule_type', { length: 50 }).notNull(),
  ruleConfig: jsonb('rule_config').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdIdx: index('idx_validation_rules_brand_id').on(table.brandId),
  categoryIdx: index('idx_validation_rules_category').on(table.category),
}));

// Asset Versions
export const assetVersions = pgTable('asset_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  url: text('url').notNull(),
  content: jsonb('content'),
  qualityScore: real('quality_score'),
  validationResult: jsonb('validation_result'),
  revisionReason: text('revision_reason'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  assetIdIdx: index('idx_asset_versions_asset_id').on(table.assetId),
  assetVersionUnique: uniqueIndex('idx_asset_versions_unique').on(table.assetId, table.versionNumber),
}));

// Export History
export const exportHistory = pgTable('export_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  format: varchar('format', { length: 10 }).notNull(),
  options: jsonb('options').default({}),
  downloadUrl: text('download_url').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  downloadedAt: timestamp('downloaded_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  assetIdIdx: index('idx_export_history_asset_id').on(table.assetId),
  userIdIdx: index('idx_export_history_user_id').on(table.userId),
}));

// API Keys
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull(),
  keyPrefix: varchar('key_prefix', { length: 10 }).notNull(),
  permissions: jsonb('permissions').default(['read']),
  rateLimit: integer('rate_limit').default(100),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  revokedAt: timestamp('revoked_at'),
}, (table) => ({
  brandIdIdx: index('idx_api_keys_brand_id').on(table.brandId),
  keyPrefixIdx: index('idx_api_keys_key_prefix').on(table.keyPrefix),
}));

// Audit Log
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  brandId: uuid('brand_id').references(() => brands.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_audit_log_user_id').on(table.userId),
  brandIdIdx: index('idx_audit_log_brand_id').on(table.brandId),
  actionIdx: index('idx_audit_log_action').on(table.action),
  createdAtIdx: index('idx_audit_log_created_at').on(table.createdAt),
}));

// Usage Metrics
export const usageMetrics = pgTable('usage_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  assetsGenerated: integer('assets_generated').default(0),
  apiCalls: integer('api_calls').default(0),
  storageBytes: bigint('storage_bytes', { mode: 'number' }).default(0),
  aiTokensUsed: bigint('ai_tokens_used', { mode: 'number' }).default(0),
  breakdown: jsonb('breakdown').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  brandIdIdx: index('idx_usage_metrics_brand_id').on(table.brandId),
  periodIdx: index('idx_usage_metrics_period').on(table.periodStart, table.periodEnd),
  brandPeriodUnique: uniqueIndex('idx_usage_metrics_unique').on(table.brandId, table.periodStart, table.periodEnd),
}));

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  brands: many(brands),
  brandMembers: many(brandMembers),
  apiKeys: many(apiKeys),
  exportHistory: many(exportHistory),
  assetVersions: many(assetVersions),
  auditLogs: many(auditLog),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  owner: one(users, {
    fields: [brands.userId],
    references: [users.id],
  }),
  members: many(brandMembers),
  products: many(products),
  campaigns: many(campaigns),
  templates: many(templates),
  assets: many(assets),
  generationJobs: many(generationJobs),
  validationRules: many(validationRules),
  apiKeys: many(apiKeys),
  usageMetrics: many(usageMetrics),
  auditLogs: many(auditLog),
}));

export const brandMembersRelations = relations(brandMembers, ({ one }) => ({
  brand: one(brands, {
    fields: [brandMembers.brandId],
    references: [brands.id],
  }),
  user: one(users, {
    fields: [brandMembers.userId],
    references: [users.id],
  }),
  inviter: one(users, {
    fields: [brandMembers.invitedBy],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  brand: one(brands, {
    fields: [campaigns.brandId],
    references: [brands.id],
  }),
  assets: many(assets),
  generationJobs: many(generationJobs),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  brand: one(brands, {
    fields: [templates.brandId],
    references: [brands.id],
  }),
  assets: many(assets),
  generationJobs: many(generationJobs),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  brand: one(brands, {
    fields: [assets.brandId],
    references: [brands.id],
  }),
  campaign: one(campaigns, {
    fields: [assets.campaignId],
    references: [campaigns.id],
  }),
  template: one(templates, {
    fields: [assets.templateId],
    references: [templates.id],
  }),
  versions: many(assetVersions),
  exports: many(exportHistory),
  generationJob: one(generationJobs, {
    fields: [assets.id],
    references: [generationJobs.assetId],
  }),
}));

export const generationJobsRelations = relations(generationJobs, ({ one }) => ({
  brand: one(brands, {
    fields: [generationJobs.brandId],
    references: [brands.id],
  }),
  campaign: one(campaigns, {
    fields: [generationJobs.campaignId],
    references: [campaigns.id],
  }),
  template: one(templates, {
    fields: [generationJobs.templateId],
    references: [templates.id],
  }),
  asset: one(assets, {
    fields: [generationJobs.assetId],
    references: [assets.id],
  }),
}));

export const validationRulesRelations = relations(validationRules, ({ one }) => ({
  brand: one(brands, {
    fields: [validationRules.brandId],
    references: [brands.id],
  }),
}));

export const assetVersionsRelations = relations(assetVersions, ({ one }) => ({
  asset: one(assets, {
    fields: [assetVersions.assetId],
    references: [assets.id],
  }),
  createdByUser: one(users, {
    fields: [assetVersions.createdBy],
    references: [users.id],
  }),
}));

export const exportHistoryRelations = relations(exportHistory, ({ one }) => ({
  asset: one(assets, {
    fields: [exportHistory.assetId],
    references: [assets.id],
  }),
  user: one(users, {
    fields: [exportHistory.userId],
    references: [users.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  brand: one(brands, {
    fields: [apiKeys.brandId],
    references: [brands.id],
  }),
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
  brand: one(brands, {
    fields: [auditLog.brandId],
    references: [brands.id],
  }),
}));

export const usageMetricsRelations = relations(usageMetrics, ({ one }) => ({
  brand: one(brands, {
    fields: [usageMetrics.brandId],
    references: [brands.id],
  }),
}));

// ============================================================================
// TYPES (Inferidos do schema)
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;

export type BrandMember = typeof brandMembers.$inferSelect;
export type NewBrandMember = typeof brandMembers.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

export type GenerationJob = typeof generationJobs.$inferSelect;
export type NewGenerationJob = typeof generationJobs.$inferInsert;

export type ValidationRule = typeof validationRules.$inferSelect;
export type NewValidationRule = typeof validationRules.$inferInsert;

export type AssetVersion = typeof assetVersions.$inferSelect;
export type NewAssetVersion = typeof assetVersions.$inferInsert;

export type ExportHistory = typeof exportHistory.$inferSelect;
export type NewExportHistory = typeof exportHistory.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;

export type UsageMetrics = typeof usageMetrics.$inferSelect;
export type NewUsageMetrics = typeof usageMetrics.$inferInsert;

// ============================================================================
// CUSTOM TYPES (JSONB Schemas)
// ============================================================================

export interface BrandConfig {
  identity: {
    mission: string;
    vision: string;
    values: string[];
    personality: string[];
  };
  voice: {
    tone: string[];
    language: string;
    style: string;
    doPatterns: string[];
    dontPatterns: string[];
  };
  visuals: {
    primaryColors: Array<{ name: string; hex: string; usage: string }>;
    secondaryColors: Array<{ name: string; hex: string; usage: string }>;
    typography: {
      heading: { family: string; weights: number[]; fallback: string };
      body: { family: string; weights: number[]; fallback: string };
    };
    logoUrl: string;
    imageStyle: string;
  };
  audience: {
    segments: Array<{
      name: string;
      demographics: string;
      psychographics: string;
      painPoints: string[];
      desires: string[];
    }>;
    painPoints: string[];
    desires: string[];
  };
}

export interface AssetContent {
  headline: string;
  body: string;
  cta: string;
  hashtags?: string[];
}

export interface GenerationContext {
  userRequest: string;
  agentOutputs: Record<string, unknown>;
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  violations: Array<{
    ruleId: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    location?: string;
  }>;
  suggestions: Array<{
    message: string;
  }>;
}

export interface LayoutSpec {
  dimensions: { width: number; height: number };
  layers: Array<{
    id: string;
    type: 'image' | 'text' | 'shape' | 'logo';
    position: { x: number; y: number };
    size: { width: number; height: number };
    style: Record<string, unknown>;
    content?: string;
  }>;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'image' | 'color' | 'number';
  source: 'user' | 'brand' | 'product' | 'generated';
  defaultValue?: unknown;
  required: boolean;
  validation?: Record<string, unknown>;
}

export interface AgentLog {
  agent: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
}
