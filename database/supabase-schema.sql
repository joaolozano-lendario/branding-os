-- ============================================================================
-- BRANDING OS - Supabase Schema
-- ============================================================================
-- Version: 1.0.0
-- Platform: Supabase (PostgreSQL 15+)
-- Features: RLS, Auth Integration, Realtime, Storage, Edge Functions
-- Author: DB Sage v2 + AIOS Orchestrator
-- Last Updated: 2024-12-09
-- ============================================================================

-- ============================================================================
-- IMPORTANTE: Supabase Native Features
-- ============================================================================
-- 1. Auth: Usa auth.users() do Supabase Auth (não criar tabela users separada)
-- 2. RLS: Row Level Security obrigatório em todas as tabelas
-- 3. Storage: Buckets para logos, assets, templates
-- 4. Realtime: Habilitado para assets e generation_jobs
-- 5. Edge Functions: Para pipeline de geração
-- ============================================================================

-- ============================================================================
-- EXTENSIONS (já habilitadas no Supabase por padrão)
-- ============================================================================

-- Verificar/habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- ============================================================================
-- ENUMS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM (
        'draft',
        'active',
        'paused',
        'completed',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM (
        'post',
        'story',
        'carousel',
        'banner',
        'ad',
        'slide'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE platform_type AS ENUM (
        'instagram',
        'linkedin',
        'facebook',
        'twitter',
        'tiktok',
        'youtube',
        'generic'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE template_type AS ENUM (
        'copy',
        'layout',
        'full'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'owner',
        'editor',
        'viewer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE validation_severity AS ENUM (
        'error',
        'warning',
        'info'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE generation_status AS ENUM (
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLE: profiles
-- Extensão do auth.users do Supabase
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    -- Metadata adicional
    company_name TEXT,
    job_title TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    locale TEXT DEFAULT 'pt-BR',
    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT false,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para criar profile automaticamente quando user se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

-- Trigger no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- TABLE: brands
-- Marcas/Identidades de marca
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,

    -- Storage references (Supabase Storage)
    logo_path TEXT, -- path no bucket 'brand-assets'

    -- Brand Config completo
    brand_config JSONB NOT NULL DEFAULT '{
        "identity": {
            "mission": "",
            "vision": "",
            "values": [],
            "personality": []
        },
        "voice": {
            "tone": [],
            "language": "pt-BR",
            "style": "",
            "doPatterns": [],
            "dontPatterns": []
        },
        "visuals": {
            "primaryColors": [],
            "secondaryColors": [],
            "typography": {
                "heading": {"family": "Inter", "weights": [600, 700], "fallback": "sans-serif"},
                "body": {"family": "Inter", "weights": [400, 500], "fallback": "sans-serif"}
            },
            "logoUrl": "",
            "imageStyle": ""
        },
        "audience": {
            "segments": [],
            "painPoints": [],
            "desires": []
        }
    }'::jsonb,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brands_owner_id ON public.brands(owner_id);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_config_gin ON public.brands USING GIN (brand_config);

-- RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brands"
    ON public.brands FOR SELECT
    USING (owner_id = auth.uid() OR id IN (
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create brands"
    ON public.brands FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update brands"
    ON public.brands FOR UPDATE
    USING (owner_id = auth.uid() OR id IN (
        SELECT brand_id FROM public.brand_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    ));

CREATE POLICY "Owners can delete brands"
    ON public.brands FOR DELETE
    USING (owner_id = auth.uid());

-- ============================================================================
-- TABLE: brand_members
-- Membros com acesso a uma marca (multi-tenant)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.brand_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,

    UNIQUE(brand_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brand_members_brand_id ON public.brand_members(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_members_user_id ON public.brand_members(user_id);

-- RLS
ALTER TABLE public.brand_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their memberships"
    ON public.brand_members FOR SELECT
    USING (user_id = auth.uid() OR brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
    ));

CREATE POLICY "Owners can manage members"
    ON public.brand_members FOR ALL
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
    ));

-- ============================================================================
-- TABLE: products
-- Produtos associados a uma marca
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    price DECIMAL(10, 2),
    currency TEXT DEFAULT 'BRL',
    image_path TEXT, -- path no bucket 'brand-assets'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products of their brands"
    ON public.products FOR SELECT
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage products of their brands"
    ON public.products FOR ALL
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    ));

-- ============================================================================
-- TABLE: campaigns
-- Campanhas de marketing
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    target_audience TEXT,
    key_messages JSONB DEFAULT '[]'::jsonb,
    start_date DATE,
    end_date DATE,
    status campaign_status DEFAULT 'draft',
    budget DECIMAL(10, 2),
    currency TEXT DEFAULT 'BRL',
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view campaigns of their brands"
    ON public.campaigns FOR SELECT
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage campaigns of their brands"
    ON public.campaigns FOR ALL
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    ));

-- ============================================================================
-- TABLE: templates
-- Templates reutilizáveis para geração
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL, -- NULL = global
    created_by UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    type template_type NOT NULL,
    category TEXT,

    -- Specs
    dimensions JSONB, -- {"width": 1080, "height": 1080}
    platform platform_type,
    asset_type asset_type,

    -- Content
    layout_spec JSONB NOT NULL DEFAULT '{}'::jsonb,
    copy_structure JSONB DEFAULT '{}'::jsonb,
    variables JSONB DEFAULT '[]'::jsonb,

    -- Storage
    thumbnail_path TEXT,

    -- Metadata
    is_public BOOLEAN DEFAULT false,
    is_system BOOLEAN DEFAULT false, -- templates do sistema
    usage_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_templates_brand_id ON public.templates(brand_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON public.templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON public.templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_templates_is_system ON public.templates(is_system) WHERE is_system = true;

-- RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public/system templates"
    ON public.templates FOR SELECT
    USING (is_public = true OR is_system = true OR brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage templates of their brands"
    ON public.templates FOR ALL
    USING (
        created_by = auth.uid() OR
        brand_id IN (
            SELECT id FROM public.brands WHERE owner_id = auth.uid()
            UNION
            SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

-- ============================================================================
-- TABLE: assets
-- Assets gerados pelo sistema
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),

    -- Tipo e plataforma
    type asset_type NOT NULL,
    platform platform_type NOT NULL DEFAULT 'generic',

    -- Storage (Supabase Storage)
    file_path TEXT NOT NULL, -- path no bucket 'generated-assets'
    thumbnail_path TEXT,
    file_size INTEGER,
    format TEXT, -- png, jpg, svg
    dimensions JSONB, -- {"width": 1080, "height": 1080}

    -- Conteúdo
    content JSONB DEFAULT '{}'::jsonb,
    -- {"headline": "", "body": "", "cta": "", "hashtags": []}

    -- Contexto de geração
    generation_context JSONB DEFAULT '{}'::jsonb,
    -- {"userRequest": "", "agentOutputs": {...}}

    -- Validação
    quality_score REAL,
    validation_result JSONB DEFAULT '{}'::jsonb,
    -- {"passed": true, "score": 0.92, "violations": [], "suggestions": []}

    -- Status
    status generation_status DEFAULT 'completed',
    is_favorite BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    tags JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assets_brand_id ON public.assets(brand_id);
CREATE INDEX IF NOT EXISTS idx_assets_campaign_id ON public.assets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON public.assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_platform ON public.assets(platform);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON public.assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_brand_created ON public.assets(brand_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_is_favorite ON public.assets(is_favorite) WHERE is_favorite = true;

-- RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assets of their brands"
    ON public.assets FOR SELECT
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage assets of their brands"
    ON public.assets FOR ALL
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    ));

-- Habilitar Realtime para assets
ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;

-- ============================================================================
-- TABLE: generation_jobs
-- Jobs de geração (com Realtime para status updates)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),

    -- Request
    user_request TEXT NOT NULL,
    asset_type asset_type,
    platform platform_type,

    -- Status (com Realtime)
    status generation_status DEFAULT 'pending',
    progress INTEGER DEFAULT 0, -- 0-100
    current_agent TEXT,

    -- Resultado
    asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
    error_message TEXT,
    error_details JSONB,

    -- Métricas
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,

    -- Logs dos agentes
    agent_logs JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_generation_jobs_brand_id ON public.generation_jobs(brand_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON public.generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_created_by ON public.generation_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_created_at ON public.generation_jobs(created_at DESC);

-- RLS
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their generation jobs"
    ON public.generation_jobs FOR SELECT
    USING (created_by = auth.uid() OR brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create generation jobs"
    ON public.generation_jobs FOR INSERT
    WITH CHECK (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    ));

-- Habilitar Realtime para jobs
ALTER PUBLICATION supabase_realtime ADD TABLE public.generation_jobs;

-- ============================================================================
-- TABLE: validation_rules
-- Regras de validação customizadas por marca
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.validation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE, -- NULL = global
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- brand, platform, accessibility, legal
    severity validation_severity NOT NULL DEFAULT 'warning',
    rule_type TEXT NOT NULL, -- color, pattern, dimension, contrast
    rule_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_validation_rules_brand_id ON public.validation_rules(brand_id);
CREATE INDEX IF NOT EXISTS idx_validation_rules_category ON public.validation_rules(category);

-- RLS
ALTER TABLE public.validation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view validation rules"
    ON public.validation_rules FOR SELECT
    USING (brand_id IS NULL OR brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage validation rules of their brands"
    ON public.validation_rules FOR ALL
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
    ));

-- ============================================================================
-- TABLE: asset_versions
-- Versionamento de assets
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.asset_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    content JSONB,
    quality_score REAL,
    validation_result JSONB,
    revision_reason TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(asset_id, version_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_asset_versions_asset_id ON public.asset_versions(asset_id);

-- RLS
ALTER TABLE public.asset_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of their assets"
    ON public.asset_versions FOR SELECT
    USING (asset_id IN (
        SELECT id FROM public.assets WHERE brand_id IN (
            SELECT id FROM public.brands WHERE owner_id = auth.uid()
            UNION
            SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
        )
    ));

-- ============================================================================
-- TABLE: api_keys
-- Chaves de API para integrações
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL, -- Hash SHA256 da key
    key_prefix TEXT NOT NULL, -- Primeiros 8 chars para identificação
    permissions JSONB DEFAULT '["read"]'::jsonb,
    rate_limit INTEGER DEFAULT 100, -- requests/hora
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    revoked_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_brand_id ON public.api_keys(brand_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON public.api_keys(key_prefix);

-- RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage API keys"
    ON public.api_keys FOR ALL
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
    ));

-- ============================================================================
-- TABLE: usage_metrics
-- Métricas de uso para billing
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    assets_generated INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    storage_bytes BIGINT DEFAULT 0,
    ai_tokens_used BIGINT DEFAULT 0,
    breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(brand_id, period_start, period_end)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_metrics_brand_id ON public.usage_metrics(brand_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_period ON public.usage_metrics(period_start, period_end);

-- RLS
ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view usage metrics"
    ON public.usage_metrics FOR SELECT
    USING (brand_id IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
    ));

-- ============================================================================
-- FUNCTIONS: Utility functions
-- ============================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Aplicar trigger em todas as tabelas com updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
            CREATE TRIGGER set_updated_at
                BEFORE UPDATE ON public.%I
                FOR EACH ROW
                EXECUTE FUNCTION public.handle_updated_at();
        ', t, t);
    END LOOP;
END;
$$;

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION public.generate_unique_slug(base_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    slug TEXT;
    counter INTEGER := 0;
    slug_exists BOOLEAN;
BEGIN
    -- Normalizar: lowercase, remover acentos, substituir espaços por hífens
    slug := lower(unaccent(base_name));
    slug := regexp_replace(slug, '[^a-z0-9]+', '-', 'g');
    slug := trim(both '-' from slug);

    LOOP
        IF counter = 0 THEN
            SELECT EXISTS(SELECT 1 FROM public.brands WHERE brands.slug = slug) INTO slug_exists;
        ELSE
            SELECT EXISTS(SELECT 1 FROM public.brands WHERE brands.slug = slug || '-' || counter) INTO slug_exists;
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
$$;

-- Função para incrementar usage_count de template
CREATE OR REPLACE FUNCTION public.increment_template_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.template_id IS NOT NULL THEN
        UPDATE public.templates
        SET usage_count = usage_count + 1
        WHERE id = NEW.template_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER increment_template_usage_on_asset
    AFTER INSERT ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_template_usage();

-- Função para atualizar métricas de uso
CREATE OR REPLACE FUNCTION public.update_usage_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    current_period_start DATE;
    current_period_end DATE;
BEGIN
    -- Período mensal
    current_period_start := date_trunc('month', now())::date;
    current_period_end := (date_trunc('month', now()) + interval '1 month' - interval '1 day')::date;

    -- Upsert métricas
    INSERT INTO public.usage_metrics (brand_id, period_start, period_end, assets_generated)
    VALUES (NEW.brand_id, current_period_start, current_period_end, 1)
    ON CONFLICT (brand_id, period_start, period_end)
    DO UPDATE SET
        assets_generated = usage_metrics.assets_generated + 1,
        updated_at = now();

    RETURN NEW;
END;
$$;

CREATE TRIGGER update_usage_on_asset
    AFTER INSERT ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_usage_metrics();

-- ============================================================================
-- VIEWS: Views úteis
-- ============================================================================

-- View de assets com informações completas
CREATE OR REPLACE VIEW public.v_assets_full AS
SELECT
    a.*,
    b.name AS brand_name,
    b.slug AS brand_slug,
    c.name AS campaign_name,
    t.name AS template_name,
    t.type AS template_type,
    p.full_name AS created_by_name
FROM public.assets a
LEFT JOIN public.brands b ON a.brand_id = b.id
LEFT JOIN public.campaigns c ON a.campaign_id = c.id
LEFT JOIN public.templates t ON a.template_id = t.id
LEFT JOIN public.profiles p ON a.created_by = p.id;

-- View de estatísticas por marca
CREATE OR REPLACE VIEW public.v_brand_stats AS
SELECT
    b.id AS brand_id,
    b.name AS brand_name,
    b.slug AS brand_slug,
    COUNT(DISTINCT a.id) AS total_assets,
    COUNT(DISTINCT c.id) AS total_campaigns,
    COUNT(DISTINCT t.id) AS total_templates,
    COUNT(DISTINCT pr.id) AS total_products,
    AVG(a.quality_score) AS avg_quality_score,
    MAX(a.created_at) AS last_asset_created
FROM public.brands b
LEFT JOIN public.assets a ON b.id = a.brand_id AND a.is_archived = false
LEFT JOIN public.campaigns c ON b.id = c.brand_id
LEFT JOIN public.templates t ON b.id = t.brand_id
LEFT JOIN public.products pr ON b.id = pr.brand_id
GROUP BY b.id, b.name, b.slug;

-- ============================================================================
-- STORAGE BUCKETS (executar no Supabase Dashboard ou via API)
-- ============================================================================

-- Bucket para logos e assets de marca
-- INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', false);

-- Bucket para assets gerados
-- INSERT INTO storage.buckets (id, name, public) VALUES ('generated-assets', 'generated-assets', false);

-- Bucket para thumbnails (público para preview rápido)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);

-- ============================================================================
-- STORAGE POLICIES (exemplo)
-- ============================================================================

-- Policy para brand-assets bucket
-- CREATE POLICY "Users can upload brand assets"
--     ON storage.objects FOR INSERT
--     WITH CHECK (
--         bucket_id = 'brand-assets' AND
--         (storage.foldername(name))[1] IN (
--             SELECT id::text FROM public.brands WHERE owner_id = auth.uid()
--             UNION
--             SELECT brand_id::text FROM public.brand_members WHERE user_id = auth.uid()
--         )
--     );

-- ============================================================================
-- SEED DATA: Templates de sistema
-- ============================================================================

-- Serão inseridos via migration separada

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.profiles IS 'Extensão do auth.users do Supabase';
COMMENT ON TABLE public.brands IS 'Identidades de marca com configuração completa';
COMMENT ON TABLE public.brand_members IS 'Controle de acesso multi-tenant';
COMMENT ON TABLE public.products IS 'Produtos/serviços da marca';
COMMENT ON TABLE public.campaigns IS 'Campanhas de marketing';
COMMENT ON TABLE public.templates IS 'Templates reutilizáveis (copy, layout, full)';
COMMENT ON TABLE public.assets IS 'Assets gerados pelo pipeline multi-agente';
COMMENT ON TABLE public.generation_jobs IS 'Queue de jobs com status em tempo real';
COMMENT ON TABLE public.validation_rules IS 'Regras customizadas do Quality Gate';
COMMENT ON TABLE public.api_keys IS 'API keys para integrações externas';
COMMENT ON TABLE public.usage_metrics IS 'Métricas de uso para billing';

-- ============================================================================
-- END OF SUPABASE SCHEMA
-- ============================================================================

/*
RESUMO SUPABASE NATIVE:

INTEGRAÇÃO COM AUTH:
- Usa auth.users() nativo do Supabase
- profiles extende auth.users com dados adicionais
- Trigger automático cria profile no signup

ROW LEVEL SECURITY (RLS):
- Todas as tabelas têm RLS habilitado
- Policies baseadas em auth.uid()
- Multi-tenant via brand_members

STORAGE:
- brand-assets: logos, imagens de produto
- generated-assets: assets do pipeline
- thumbnails: previews públicos

REALTIME:
- assets: notificações de novos assets
- generation_jobs: status updates em tempo real

EDGE FUNCTIONS (sugeridas):
- generate-asset: pipeline de geração
- export-asset: export em diferentes formatos
- validate-asset: validação isolada

FEATURES EXTRAS:
- Triggers para updated_at automático
- Trigger para incrementar usage_count
- Trigger para métricas de uso
- Views para queries comuns
- Função para slug único
*/
