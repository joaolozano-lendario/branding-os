# BRANDING OS - Entity Relationship Diagram

## Diagrama Visual

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    BRANDING OS ERD                                       │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │    users     │
                                    ├──────────────┤
                                    │ id (PK)      │
                                    │ email (UK)   │
                                    │ name         │
                                    │ password_hash│
                                    │ avatar_url   │
                                    │ is_active    │
                                    │ created_at   │
                                    │ updated_at   │
                                    └──────┬───────┘
                                           │
                                           │ 1:N (owner)
                                           ▼
┌──────────────┐                   ┌──────────────┐                    ┌──────────────┐
│   api_keys   │                   │    brands    │                    │brand_members │
├──────────────┤                   ├──────────────┤                    ├──────────────┤
│ id (PK)      │◄──────────────────│ id (PK)      │───────────────────►│ id (PK)      │
│ brand_id(FK) │     1:N           │ user_id (FK) │      1:N           │ brand_id(FK) │
│ user_id (FK) │                   │ name         │                    │ user_id (FK) │
│ name         │                   │ slug (UK)    │                    │ role         │
│ key_hash     │                   │ description  │                    │ invited_by   │
│ permissions  │                   │ logo_url     │                    │ accepted_at  │
│ rate_limit   │                   │ brand_config │                    └──────────────┘
│ is_active    │                   │ is_active    │
└──────────────┘                   │ created_at   │
                                   │ updated_at   │
                                   └──────┬───────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            │                             │                             │
            │ 1:N                         │ 1:N                         │ 1:N
            ▼                             ▼                             ▼
    ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
    │   products   │              │  campaigns   │              │  templates   │
    ├──────────────┤              ├──────────────┤              ├──────────────┤
    │ id (PK)      │              │ id (PK)      │              │ id (PK)      │
    │ brand_id(FK) │              │ brand_id(FK) │              │ brand_id(FK) │
    │ name         │              │ name         │              │ name         │
    │ description  │              │ description  │              │ type         │
    │ features     │              │ objective    │              │ layout_spec  │
    │ benefits     │              │ key_messages │              │ variables    │
    │ price        │              │ start_date   │              │ platform     │
    │ is_active    │              │ end_date     │              │ asset_type   │
    └──────────────┘              │ status       │              │ is_public    │
                                  │ budget       │              └──────┬───────┘
                                  └──────┬───────┘                     │
                                         │                             │
                                         │ 1:N                         │ 1:N
                                         ▼                             │
                                  ┌──────────────┐                     │
                                  │    assets    │◄────────────────────┘
                                  ├──────────────┤
                                  │ id (PK)      │
                                  │ brand_id(FK) │───────────────┐
                                  │ campaign_id  │               │
                                  │ template_id  │               │
                                  │ type         │               │
                                  │ platform     │               │
                                  │ url          │               │
                                  │ content      │               │
                                  │ quality_score│               │
                                  │ validation   │               │
                                  │ status       │               │
                                  │ created_at   │               │
                                  └──────┬───────┘               │
                                         │                       │
            ┌────────────────────────────┼───────────────────────┤
            │                            │                       │
            │ 1:N                        │ 1:N                   │ 1:N
            ▼                            ▼                       ▼
    ┌──────────────┐              ┌──────────────┐       ┌──────────────┐
    │asset_versions│              │export_history│       │generation_job│
    ├──────────────┤              ├──────────────┤       ├──────────────┤
    │ id (PK)      │              │ id (PK)      │       │ id (PK)      │
    │ asset_id(FK) │              │ asset_id(FK) │       │ brand_id(FK) │
    │ version_num  │              │ user_id (FK) │       │ user_request │
    │ url          │              │ format       │       │ status       │
    │ content      │              │ download_url │       │ progress     │
    │ quality_score│              │ expires_at   │       │ agent_logs   │
    │ created_at   │              │ created_at   │       │ asset_id(FK) │
    └──────────────┘              └──────────────┘       │ error_msg    │
                                                        │ duration_ms  │
                                                        └──────────────┘

                     ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
                     │validation_   │       │  audit_log   │       │usage_metrics │
                     │    rules     │       ├──────────────┤       ├──────────────┤
                     ├──────────────┤       │ id (PK)      │       │ id (PK)      │
                     │ id (PK)      │       │ user_id (FK) │       │ brand_id(FK) │
                     │ brand_id(FK) │       │ brand_id(FK) │       │ period_start │
                     │ name         │       │ action       │       │ period_end   │
                     │ category     │       │ entity_type  │       │ assets_gen   │
                     │ severity     │       │ entity_id    │       │ api_calls    │
                     │ rule_type    │       │ old_values   │       │ storage_bytes│
                     │ rule_config  │       │ new_values   │       │ breakdown    │
                     │ is_active    │       │ ip_address   │       └──────────────┘
                     └──────────────┘       │ created_at   │
                                           └──────────────┘
```

---

## Cardinalidades

| Relacionamento | Tipo | Descrição |
|----------------|------|-----------|
| users → brands | 1:N | Um usuário pode ter várias marcas |
| users ↔ brands (via brand_members) | N:N | Multi-tenant: usuários podem ser membros de várias marcas |
| brands → products | 1:N | Uma marca tem vários produtos |
| brands → campaigns | 1:N | Uma marca tem várias campanhas |
| brands → templates | 1:N | Uma marca tem vários templates (ou NULL para globais) |
| brands → assets | 1:N | Uma marca tem vários assets |
| campaigns → assets | 1:N | Uma campanha agrupa vários assets |
| templates → assets | 1:N | Um template pode gerar vários assets |
| brands → generation_jobs | 1:N | Jobs de geração pertencem a uma marca |
| assets → asset_versions | 1:N | Um asset tem várias versões |
| assets → export_history | 1:N | Histórico de exports de um asset |
| brands → validation_rules | 1:N | Regras customizadas por marca |
| brands → api_keys | 1:N | Chaves de API por marca |
| brands → usage_metrics | 1:N | Métricas de uso por marca |

---

## Tabelas por Categoria

### Core (Entidades Principais)
| Tabela | Propósito | Rows Estimados |
|--------|-----------|----------------|
| users | Autenticação e perfil | 100-1K |
| brands | Identidades de marca | 100-1K |
| products | Produtos/serviços | 1K-10K |
| campaigns | Campanhas de marketing | 1K-10K |
| templates | Templates reutilizáveis | 100-1K |
| assets | Assets gerados | 10K-1M |

### Access Control (Multi-tenant)
| Tabela | Propósito | Rows Estimados |
|--------|-----------|----------------|
| brand_members | Acesso compartilhado | 1K-10K |
| api_keys | Integrações externas | 100-1K |

### Pipeline (Geração)
| Tabela | Propósito | Rows Estimados |
|--------|-----------|----------------|
| generation_jobs | Queue de jobs | 10K-100K |
| validation_rules | Regras do Quality Gate | 100-1K |

### Audit & Analytics
| Tabela | Propósito | Rows Estimados |
|--------|-----------|----------------|
| asset_versions | Histórico de revisões | 10K-100K |
| export_history | Tracking de downloads | 10K-100K |
| audit_log | Compliance | 100K-1M |
| usage_metrics | Billing/Analytics | 10K-100K |

---

## Campos JSONB (Schemas)

### brands.brand_config
```json
{
  "identity": {
    "mission": "string",
    "vision": "string",
    "values": ["string"],
    "personality": ["string"]
  },
  "voice": {
    "tone": ["string"],
    "language": "string",
    "style": "string",
    "doPatterns": ["string"],
    "dontPatterns": ["string"]
  },
  "visuals": {
    "primaryColors": [{"name": "string", "hex": "#XXXXXX", "usage": "string"}],
    "secondaryColors": [{"name": "string", "hex": "#XXXXXX", "usage": "string"}],
    "typography": {
      "heading": {"family": "string", "weights": [number], "fallback": "string"},
      "body": {"family": "string", "weights": [number], "fallback": "string"}
    },
    "logoUrl": "string",
    "imageStyle": "string"
  },
  "audience": {
    "segments": [{
      "name": "string",
      "demographics": "string",
      "psychographics": "string",
      "painPoints": ["string"],
      "desires": ["string"]
    }],
    "painPoints": ["string"],
    "desires": ["string"]
  }
}
```

### assets.content
```json
{
  "headline": "string",
  "body": "string",
  "cta": "string",
  "hashtags": ["string"]
}
```

### assets.generation_context
```json
{
  "userRequest": "string",
  "agentOutputs": {
    "analyzer": {...},
    "strategist": {...},
    "copywriter": {...},
    "visualDirector": {...},
    "composer": {...}
  }
}
```

### assets.validation_result
```json
{
  "passed": true,
  "score": 0.92,
  "violations": [{
    "ruleId": "string",
    "severity": "error|warning|info",
    "message": "string",
    "location": "string"
  }],
  "suggestions": [{
    "message": "string"
  }]
}
```

### templates.layout_spec
```json
{
  "dimensions": {"width": 1080, "height": 1080},
  "layers": [{
    "id": "string",
    "type": "image|text|shape|logo",
    "position": {"x": 0, "y": 0},
    "size": {"width": 100, "height": 100},
    "style": {...},
    "content": "{{variable}}"
  }]
}
```

### templates.variables
```json
[{
  "name": "string",
  "type": "text|image|color|number",
  "source": "user|brand|product|generated",
  "defaultValue": "any",
  "required": true,
  "validation": {...}
}]
```

### generation_jobs.agent_logs
```json
[{
  "agent": "analyzer|strategist|copywriter|visualDirector|composer|qualityGate",
  "startedAt": "timestamp",
  "completedAt": "timestamp",
  "durationMs": 1500,
  "input": {...},
  "output": {...}
}]
```

---

## Indexes Estratégicos

### High-Traffic Queries

```sql
-- Listar assets de uma marca ordenados por data
idx_assets_brand_created ON assets(brand_id, created_at DESC)

-- Buscar brand config por queries JSONB
idx_brands_config_gin ON brands USING GIN (brand_config)

-- Filtrar assets por tipo e plataforma
idx_assets_type ON assets(type)
idx_assets_platform ON assets(platform)

-- Jobs pendentes para processamento
idx_generation_jobs_status ON generation_jobs(status)
```

### Security Queries

```sql
-- Verificar acesso de usuário a marca
idx_brand_members_brand_id ON brand_members(brand_id)
idx_brand_members_user_id ON brand_members(user_id)

-- Validar API key
idx_api_keys_key_prefix ON api_keys(key_prefix)
```

---

## Enums

| Enum | Valores |
|------|---------|
| campaign_status | draft, active, paused, completed, archived |
| asset_type | post, story, carousel, banner, ad, slide |
| platform_type | instagram, linkedin, facebook, twitter, tiktok, youtube, generic |
| template_type | copy, layout, full |
| user_role | owner, editor, viewer |
| validation_severity | error, warning, info |
| generation_status | pending, processing, completed, failed, cancelled |

---

*Generated by DB Sage v2 + AIOS Orchestrator*
*Last Updated: 2024-12-09*
