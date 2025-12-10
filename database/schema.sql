-- ============================================================================
-- BRANDING OS - Database Schema
-- ============================================================================
-- Version: 1.0.0
-- Database: PostgreSQL 15+ (SQLite compatible com adaptações)
-- ORM: Drizzle ORM
-- Author: DB Sage v2 + AIOS Orchestrator
-- Last Updated: 2024-12-09
-- ============================================================================

-- ============================================================================
-- EXTENSIONS (PostgreSQL only)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Status de campanhas
CREATE TYPE campaign_status AS ENUM (
    'draft',
    'active',
    'paused',
    'completed',
    'archived'
);

-- Tipos de assets
CREATE TYPE asset_type AS ENUM (
    'post',
    'story',
    'carousel',
    'banner',
    'ad',
    'slide'
);

-- Plataformas suportadas
CREATE TYPE platform_type AS ENUM (
    'instagram',
    'linkedin',
    'facebook',
    'twitter',
    'tiktok',
    'youtube',
    'generic'
);

-- Tipos de templates
CREATE TYPE template_type AS ENUM (
    'copy',
    'layout',
    'full'
);

-- Roles de usuário
CREATE TYPE user_role AS ENUM (
    'owner',
    'editor',
    'viewer'
);

-- Severidade de validação
CREATE TYPE validation_severity AS ENUM (
    'error',
    'warning',
    'info'
);

-- Status de geração
CREATE TYPE generation_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
);

-- ============================================================================
-- TABLE: users
-- Usuários do sistema
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = true;

COMMENT ON TABLE users IS 'Usuários do Branding OS';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt da senha';

-- ============================================================================
-- TABLE: brands
-- Marcas/Identidades de marca
-- ============================================================================

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,

    -- Brand Config (JSONB para flexibilidade)
    brand_config JSONB NOT NULL DEFAULT '{}',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_is_active ON brands(is_active) WHERE is_active = true;
CREATE INDEX idx_brands_config_gin ON brands USING GIN (brand_config);

COMMENT ON TABLE brands IS 'Identidades de marca configuradas';
COMMENT ON COLUMN brands.brand_config IS 'Configuração completa da marca em JSON (identity, voice, visuals, audience)';

-- ============================================================================
-- TABLE: brand_config (estrutura documentada)
-- JSONB Schema para brand_config:
-- {
--   "identity": {
--     "mission": "string",
--     "vision": "string",
--     "values": ["string"],
--     "personality": ["string"]
--   },
--   "voice": {
--     "tone": ["string"],
--     "language": "string",
--     "style": "string",
--     "doPatterns": ["string"],
--     "dontPatterns": ["string"]
--   },
--   "visuals": {
--     "primaryColors": [{"name": "string", "hex": "#XXXXXX", "usage": "string"}],
--     "secondaryColors": [{"name": "string", "hex": "#XXXXXX", "usage": "string"}],
--     "typography": {
--       "heading": {"family": "string", "weights": [number], "fallback": "string"},
--       "body": {"family": "string", "weights": [number], "fallback": "string"}
--     },
--     "logoUrl": "string",
--     "imageStyle": "string"
--   },
--   "audience": {
--     "segments": [{
--       "name": "string",
--       "demographics": "string",
--       "psychographics": "string",
--       "painPoints": ["string"],
--       "desires": ["string"]
--     }],
--     "painPoints": ["string"],
--     "desires": ["string"]
--   }
-- }
-- ============================================================================

-- ============================================================================
-- TABLE: brand_members
-- Membros com acesso a uma marca (multi-tenant)
-- ============================================================================

CREATE TABLE brand_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(brand_id, user_id)
);

CREATE INDEX idx_brand_members_brand_id ON brand_members(brand_id);
CREATE INDEX idx_brand_members_user_id ON brand_members(user_id);

COMMENT ON TABLE brand_members IS 'Controle de acesso multi-tenant por marca';

-- ============================================================================
-- TABLE: products
-- Produtos associados a uma marca
-- ============================================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    features JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'BRL',
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = true;

COMMENT ON TABLE products IS 'Produtos/serviços da marca para contextualizar geração';

-- ============================================================================
-- TABLE: campaigns
-- Campanhas de marketing
-- ============================================================================

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    objective TEXT,
    target_audience TEXT,
    key_messages JSONB DEFAULT '[]',
    start_date DATE,
    end_date DATE,
    status campaign_status DEFAULT 'draft',
    budget DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'BRL',
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

COMMENT ON TABLE campaigns IS 'Campanhas de marketing para agrupar assets';

-- ============================================================================
-- TABLE: templates
-- Templates reutilizáveis para geração
-- ============================================================================

CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL, -- NULL = template global
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type template_type NOT NULL,
    category VARCHAR(100),

    -- Especificações do template
    dimensions JSONB, -- {"width": 1080, "height": 1080}
    platform platform_type,
    asset_type asset_type,

    -- Conteúdo do template
    layout_spec JSONB NOT NULL DEFAULT '{}',
    copy_structure JSONB DEFAULT '{}',
    variables JSONB DEFAULT '[]',

    -- Metadados
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_brand_id ON templates(brand_id);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_platform ON templates(platform);
CREATE INDEX idx_templates_is_public ON templates(is_public) WHERE is_public = true;

COMMENT ON TABLE templates IS 'Templates de copy, layout ou completos para geração de assets';
COMMENT ON COLUMN templates.layout_spec IS 'Especificação de layout com layers e posicionamentos';
COMMENT ON COLUMN templates.variables IS 'Variáveis do template com tipos e valores padrão';

-- ============================================================================
-- TABLE: assets
-- Assets gerados pelo sistema
-- ============================================================================

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,

    -- Tipo e plataforma
    type asset_type NOT NULL,
    platform platform_type NOT NULL DEFAULT 'generic',

    -- Arquivo gerado
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size INTEGER, -- bytes
    format VARCHAR(10), -- png, jpg, svg
    dimensions JSONB, -- {"width": 1080, "height": 1080}

    -- Conteúdo do asset
    content JSONB DEFAULT '{}',
    -- {
    --   "headline": "string",
    --   "body": "string",
    --   "cta": "string",
    --   "hashtags": ["string"]
    -- }

    -- Contexto de geração
    generation_context JSONB DEFAULT '{}',
    -- {
    --   "userRequest": "string",
    --   "agentOutputs": {...}
    -- }

    -- Validação e qualidade
    quality_score FLOAT,
    validation_result JSONB DEFAULT '{}',
    -- {
    --   "passed": boolean,
    --   "score": number,
    --   "violations": [{...}],
    --   "suggestions": [{...}]
    -- }

    -- Status e metadados
    status generation_status DEFAULT 'completed',
    is_favorite BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assets_brand_id ON assets(brand_id);
CREATE INDEX idx_assets_campaign_id ON assets(campaign_id);
CREATE INDEX idx_assets_template_id ON assets(template_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_platform ON assets(platform);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_quality_score ON assets(quality_score DESC);
CREATE INDEX idx_assets_created_at ON assets(created_at DESC);
CREATE INDEX idx_assets_is_favorite ON assets(is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_assets_brand_created ON assets(brand_id, created_at DESC);

COMMENT ON TABLE assets IS 'Assets de marketing gerados pelo pipeline multi-agente';
COMMENT ON COLUMN assets.quality_score IS 'Score de qualidade 0-1 calculado pelo Quality Gate';
COMMENT ON COLUMN assets.generation_context IS 'Contexto completo da geração para debugging/auditoria';

-- ============================================================================
-- TABLE: generation_jobs
-- Jobs de geração (queue/status)
-- ============================================================================

CREATE TABLE generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,

    -- Request original
    user_request TEXT NOT NULL,
    asset_type asset_type,
    platform platform_type,

    -- Status do job
    status generation_status DEFAULT 'pending',
    progress INTEGER DEFAULT 0, -- 0-100
    current_agent VARCHAR(50),

    -- Resultado
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    error_message TEXT,
    error_details JSONB,

    -- Métricas
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms INTEGER,

    -- Auditoria de agentes
    agent_logs JSONB DEFAULT '[]',
    -- [{
    --   "agent": "string",
    --   "startedAt": "timestamp",
    --   "completedAt": "timestamp",
    --   "input": {...},
    --   "output": {...}
    -- }]

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_generation_jobs_brand_id ON generation_jobs(brand_id);
CREATE INDEX idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX idx_generation_jobs_created_at ON generation_jobs(created_at DESC);

COMMENT ON TABLE generation_jobs IS 'Jobs de geração para tracking assíncrono e auditoria';

-- ============================================================================
-- TABLE: validation_rules
-- Regras de validação customizadas por marca
-- ============================================================================

CREATE TABLE validation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE, -- NULL = regra global

    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- brand, platform, accessibility, legal
    severity validation_severity NOT NULL DEFAULT 'warning',

    -- Regra em si
    rule_type VARCHAR(50) NOT NULL, -- color, pattern, dimension, contrast, etc
    rule_config JSONB NOT NULL,
    -- Exemplos:
    -- color: {"allowedColors": ["#C9B298", "#1A1A1A"], "tolerance": 10}
    -- pattern: {"patterns": [...], "antiPatterns": [...]}
    -- dimension: {"minWidth": 1080, "aspectRatios": [1, 0.8, 1.91]}

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_validation_rules_brand_id ON validation_rules(brand_id);
CREATE INDEX idx_validation_rules_category ON validation_rules(category);
CREATE INDEX idx_validation_rules_is_active ON validation_rules(is_active) WHERE is_active = true;

COMMENT ON TABLE validation_rules IS 'Regras customizáveis de validação do Quality Gate';

-- ============================================================================
-- TABLE: asset_versions
-- Versionamento de assets (histórico de revisões)
-- ============================================================================

CREATE TABLE asset_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,

    -- Snapshot do asset nesta versão
    url TEXT NOT NULL,
    content JSONB,
    quality_score FLOAT,
    validation_result JSONB,

    -- Metadados da revisão
    revision_reason TEXT,
    created_by UUID REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(asset_id, version_number)
);

CREATE INDEX idx_asset_versions_asset_id ON asset_versions(asset_id);

COMMENT ON TABLE asset_versions IS 'Histórico de versões de assets para auditoria';

-- ============================================================================
-- TABLE: export_history
-- Histórico de exports de assets
-- ============================================================================

CREATE TABLE export_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    format VARCHAR(10) NOT NULL, -- png, jpg, svg, pdf
    options JSONB DEFAULT '{}', -- {"quality": 85, "scale": 2}

    download_url TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    downloaded_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_export_history_asset_id ON export_history(asset_id);
CREATE INDEX idx_export_history_user_id ON export_history(user_id);
CREATE INDEX idx_export_history_expires_at ON export_history(expires_at);

COMMENT ON TABLE export_history IS 'Tracking de exports para auditoria e analytics';

-- ============================================================================
-- TABLE: api_keys
-- Chaves de API para integrações
-- ============================================================================

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL, -- Hash da key (nunca armazenar em texto)
    key_prefix VARCHAR(10) NOT NULL, -- Primeiros caracteres para identificação

    permissions JSONB DEFAULT '["read"]', -- ["read", "write", "generate"]
    rate_limit INTEGER DEFAULT 100, -- Requests por hora

    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP
);

CREATE INDEX idx_api_keys_brand_id ON api_keys(brand_id);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;

COMMENT ON TABLE api_keys IS 'API keys para integrações externas';

-- ============================================================================
-- TABLE: audit_log
-- Log de auditoria de ações importantes
-- ============================================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,

    action VARCHAR(100) NOT NULL, -- create_asset, update_brand, delete_campaign, etc
    entity_type VARCHAR(50) NOT NULL, -- asset, brand, campaign, template
    entity_id UUID,

    old_values JSONB,
    new_values JSONB,

    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_brand_id ON audit_log(brand_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

COMMENT ON TABLE audit_log IS 'Log de auditoria para compliance e debugging';

-- ============================================================================
-- TABLE: usage_metrics
-- Métricas de uso para billing e analytics
-- ============================================================================

CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,

    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Contadores
    assets_generated INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    storage_bytes BIGINT DEFAULT 0,
    ai_tokens_used BIGINT DEFAULT 0,

    -- Breakdown por tipo
    breakdown JSONB DEFAULT '{}',
    -- {
    --   "byAssetType": {"post": 10, "story": 5},
    --   "byPlatform": {"instagram": 12, "linkedin": 3},
    --   "byAgent": {"gemini": 1000, "imagen": 15}
    -- }

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(brand_id, period_start, period_end)
);

CREATE INDEX idx_usage_metrics_brand_id ON usage_metrics(brand_id);
CREATE INDEX idx_usage_metrics_period ON usage_metrics(period_start, period_end);

COMMENT ON TABLE usage_metrics IS 'Métricas agregadas de uso por período';

-- ============================================================================
-- FUNCTIONS: Triggers de updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generation_jobs_updated_at BEFORE UPDATE ON generation_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_validation_rules_updated_at BEFORE UPDATE ON validation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_metrics_updated_at BEFORE UPDATE ON usage_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS: Utility functions
-- ============================================================================

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
    counter INTEGER := 0;
    slug_exists BOOLEAN;
BEGIN
    slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9]+', '-', 'g'));
    slug := trim(both '-' from slug);

    LOOP
        IF counter = 0 THEN
            EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1)', table_name)
            INTO slug_exists USING slug;
        ELSE
            EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1)', table_name)
            INTO slug_exists USING slug || '-' || counter;
        END IF;

        IF NOT slug_exists THEN
            IF counter = 0 THEN
                RETURN slug;
            ELSE
                RETURN slug || '-' || counter;
            END IF;
        END IF;

        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para validar brand_config
CREATE OR REPLACE FUNCTION validate_brand_config(config JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar campos obrigatórios
    IF NOT (config ? 'identity' AND config ? 'voice' AND config ? 'visuals') THEN
        RETURN FALSE;
    END IF;

    -- Verificar subcampos de identity
    IF NOT (config->'identity' ? 'mission' AND config->'identity' ? 'values') THEN
        RETURN FALSE;
    END IF;

    -- Verificar subcampos de voice
    IF NOT (config->'voice' ? 'tone' AND config->'voice' ? 'doPatterns') THEN
        RETURN FALSE;
    END IF;

    -- Verificar subcampos de visuals
    IF NOT (config->'visuals' ? 'primaryColors' AND config->'visuals' ? 'typography') THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS: Views úteis para queries comuns
-- ============================================================================

-- View de assets com informações da marca e campanha
CREATE OR REPLACE VIEW v_assets_full AS
SELECT
    a.*,
    b.name AS brand_name,
    b.slug AS brand_slug,
    c.name AS campaign_name,
    t.name AS template_name,
    t.type AS template_type
FROM assets a
LEFT JOIN brands b ON a.brand_id = b.id
LEFT JOIN campaigns c ON a.campaign_id = c.id
LEFT JOIN templates t ON a.template_id = t.id;

-- View de métricas de marca
CREATE OR REPLACE VIEW v_brand_stats AS
SELECT
    b.id AS brand_id,
    b.name AS brand_name,
    b.slug AS brand_slug,
    COUNT(DISTINCT a.id) AS total_assets,
    COUNT(DISTINCT c.id) AS total_campaigns,
    COUNT(DISTINCT t.id) AS total_templates,
    AVG(a.quality_score) AS avg_quality_score,
    MAX(a.created_at) AS last_asset_created
FROM brands b
LEFT JOIN assets a ON b.id = a.brand_id
LEFT JOIN campaigns c ON b.id = c.brand_id
LEFT JOIN templates t ON b.id = t.brand_id
GROUP BY b.id, b.name, b.slug;

-- View de jobs recentes
CREATE OR REPLACE VIEW v_recent_jobs AS
SELECT
    gj.*,
    b.name AS brand_name,
    a.url AS asset_url,
    a.quality_score
FROM generation_jobs gj
LEFT JOIN brands b ON gj.brand_id = b.id
LEFT JOIN assets a ON gj.asset_id = a.id
ORDER BY gj.created_at DESC
LIMIT 100;

-- ============================================================================
-- SEED DATA: Templates padrão globais
-- ============================================================================

-- Templates serão inseridos via migration separada ou seed script

-- ============================================================================
-- COMMENTS: Documentação das relações
-- ============================================================================

COMMENT ON CONSTRAINT brands_user_id_fkey ON brands IS 'Cada marca pertence a um usuário (owner)';
COMMENT ON CONSTRAINT assets_brand_id_fkey ON assets IS 'Cada asset pertence a uma marca';
COMMENT ON CONSTRAINT assets_campaign_id_fkey ON assets IS 'Asset pode estar associado a uma campanha';
COMMENT ON CONSTRAINT assets_template_id_fkey ON assets IS 'Asset pode ter sido gerado a partir de um template';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

/*
RESUMO DO SCHEMA:

ENTIDADES PRINCIPAIS:
- users: Usuários do sistema
- brands: Marcas com configuração completa (brand_config JSONB)
- brand_members: Controle de acesso multi-tenant
- products: Produtos/serviços da marca
- campaigns: Campanhas de marketing
- templates: Templates de copy, layout ou completos
- assets: Assets gerados pelo sistema

ENTIDADES DE SUPORTE:
- generation_jobs: Queue de jobs de geração
- validation_rules: Regras customizadas do Quality Gate
- asset_versions: Histórico de revisões
- export_history: Tracking de downloads
- api_keys: Integrations
- audit_log: Compliance e debugging
- usage_metrics: Billing e analytics

RELACIONAMENTOS:
- User 1:N Brands (owner)
- Brand N:N Users (via brand_members)
- Brand 1:N Products
- Brand 1:N Campaigns
- Brand 1:N Templates
- Brand 1:N Assets
- Campaign 1:N Assets
- Template 1:N Assets

FEATURES:
- UUID para todas as PKs
- JSONB para dados flexíveis (brand_config, metadata)
- Enums para tipos controlados
- Triggers para updated_at automático
- Indexes otimizados para queries comuns
- Views para queries frequentes
- Functions utilitárias (slug, validação)
*/
