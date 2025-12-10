# BRANDING OS - Supabase Setup Guide

## Overview

O Branding OS usa **Supabase** como backend completo:
- **Auth**: Autenticação (Email, OAuth)
- **Database**: PostgreSQL com RLS
- **Storage**: Buckets para assets
- **Realtime**: Updates em tempo real
- **Edge Functions**: Pipeline de geração

---

## 1. Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote as credenciais:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: `eyJ...`
   - **Service Role Key**: `eyJ...` (apenas para backend)

---

## 2. Executar Schema

### Via SQL Editor (Dashboard)

1. Acesse **SQL Editor** no dashboard
2. Cole o conteúdo de `supabase-schema.sql`
3. Execute

### Via CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref YOUR_PROJECT_REF

# Executar migration
supabase db push
```

---

## 3. Configurar Storage Buckets

Execute no SQL Editor:

```sql
-- Bucket para logos e assets de marca (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'brand-assets',
    'brand-assets',
    false,
    5242880, -- 5MB
    ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
);

-- Bucket para assets gerados (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'generated-assets',
    'generated-assets',
    false,
    10485760, -- 10MB
    ARRAY['image/png', 'image/jpeg', 'image/svg+xml']
);

-- Bucket para thumbnails (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'thumbnails',
    'thumbnails',
    true,
    1048576, -- 1MB
    ARRAY['image/png', 'image/jpeg', 'image/webp']
);
```

### Storage Policies

```sql
-- brand-assets: Upload por membros da marca
CREATE POLICY "Brand members can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'brand-assets' AND
    (storage.foldername(name))[1]::uuid IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Brand members can view"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'brand-assets' AND
    (storage.foldername(name))[1]::uuid IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    )
);

-- generated-assets: Mesma lógica
CREATE POLICY "Brand members can upload generated"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'generated-assets' AND
    (storage.foldername(name))[1]::uuid IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Brand members can view generated"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'generated-assets' AND
    (storage.foldername(name))[1]::uuid IN (
        SELECT id FROM public.brands WHERE owner_id = auth.uid()
        UNION
        SELECT brand_id FROM public.brand_members WHERE user_id = auth.uid()
    )
);

-- thumbnails: Público para leitura
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
```

---

## 4. Configurar Auth

### Providers Recomendados

1. **Email** (padrão, já habilitado)
2. **Google** (OAuth)
3. **GitHub** (OAuth para devs)

### Configurar no Dashboard

1. Acesse **Authentication > Providers**
2. Habilite os providers desejados
3. Configure redirect URLs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://brandingos.vercel.app/auth/callback`

### Email Templates

Customize em **Authentication > Email Templates**:
- Confirmation
- Invite
- Magic Link
- Reset Password

---

## 5. Configurar Realtime

O Realtime já está habilitado para:
- `public.assets`
- `public.generation_jobs`

### Testar Realtime

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Subscribe to new assets
const channel = supabase
  .channel('assets-changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'assets' },
    (payload) => console.log('New asset:', payload.new)
  )
  .subscribe();

// Subscribe to job status updates
const jobChannel = supabase
  .channel('job-updates')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'generation_jobs' },
    (payload) => console.log('Job updated:', payload.new)
  )
  .subscribe();
```

---

## 6. Edge Functions (Opcional)

### Estrutura

```
supabase/functions/
├── generate-asset/
│   └── index.ts
├── export-asset/
│   └── index.ts
└── validate-asset/
    └── index.ts
```

### Exemplo: generate-asset

```typescript
// supabase/functions/generate-asset/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { brandId, userRequest, platform, assetType } = await req.json();

  // Criar cliente com service role
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Criar job
  const { data: job } = await supabase
    .from('generation_jobs')
    .insert({
      brand_id: brandId,
      user_request: userRequest,
      platform,
      asset_type: assetType,
      status: 'processing',
      created_by: req.headers.get('x-user-id'),
    })
    .select()
    .single();

  // TODO: Chamar pipeline de agentes

  return new Response(JSON.stringify({ jobId: job.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Deploy

```bash
supabase functions deploy generate-asset
```

---

## 7. Variáveis de Ambiente

### .env.local (Frontend)

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### .env (Backend/Edge Functions)

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_DB_URL=postgresql://postgres:xxx@db.xxxxx.supabase.co:5432/postgres

# AI APIs
GEMINI_API_KEY=xxx
IMAGEN_API_KEY=xxx
```

---

## 8. Client SDK Setup

### Instalação

```bash
npm install @supabase/supabase-js
```

### Cliente (lib/supabase.ts)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Gerar Types

```bash
supabase gen types typescript --project-id YOUR_PROJECT_REF > src/lib/database.types.ts
```

---

## 9. Estrutura de Pastas no Storage

```
brand-assets/
└── {brand_id}/
    ├── logo.png
    ├── logo-dark.png
    └── products/
        ├── {product_id}.png
        └── ...

generated-assets/
└── {brand_id}/
    └── {year}/
        └── {month}/
            └── {asset_id}.png

thumbnails/
└── {brand_id}/
    └── {asset_id}_thumb.png
```

---

## 10. Checklist de Setup

```markdown
[ ] Criar projeto Supabase
[ ] Executar supabase-schema.sql
[ ] Criar buckets de storage
[ ] Configurar storage policies
[ ] Habilitar Auth providers
[ ] Customizar email templates
[ ] Testar Realtime
[ ] Configurar variáveis de ambiente
[ ] Instalar SDK no frontend
[ ] Gerar types do banco
[ ] Testar conexão
```

---

## Troubleshooting

### RLS Bloqueando Queries

```sql
-- Debug: Ver policies de uma tabela
SELECT * FROM pg_policies WHERE tablename = 'brands';

-- Temporariamente desabilitar RLS (APENAS DEBUG)
ALTER TABLE public.brands DISABLE ROW LEVEL SECURITY;
```

### Realtime Não Funciona

1. Verificar se a tabela está na publication:
```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

2. Adicionar tabela:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;
```

### Storage 403 Forbidden

1. Verificar policies do bucket
2. Verificar se o usuário está autenticado
3. Verificar se o path está correto (pasta = brand_id)

---

## Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Edge Functions](https://supabase.com/docs/guides/functions)

---

*Última atualização: 2024-12-09*
