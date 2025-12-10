# BRANDING OS - System Architecture

> **Version:** 1.0.0
> **Last Updated:** 2025-12-09
> **Status:** MVP Architecture

---

## 1. Architecture Overview

Branding OS follows the **C4 Model** for architecture documentation, providing multiple levels of abstraction from system context down to implementation details.

### 1.1 Level 1: System Context

```mermaid
C4Context
    title System Context - Branding OS

    Person(creator, "Content Creator", "Solopreneur or small business owner")
    Person(designer, "Designer", "Creative professional")

    System(brandingos, "Branding OS", "AI-powered brand asset generation platform")

    System_Ext(gemini, "Google Gemini", "AI language model")
    System_Ext(imagen, "Google Imagen", "AI image generation")
    System_Ext(storage, "Cloud Storage", "Asset storage")

    Rel(creator, brandingos, "Creates assets", "HTTPS")
    Rel(designer, brandingos, "Manages brand", "HTTPS")
    Rel(brandingos, gemini, "Generate copy", "API")
    Rel(brandingos, imagen, "Generate images", "API")
    Rel(brandingos, storage, "Store assets", "API")
```

**Key External Actors:**
- **Content Creators**: Primary users generating brand assets
- **Designers**: Configure brand identity and templates
- **AI Services**: Gemini 2.5 Pro for text, Imagen 3 for visuals
- **Cloud Storage**: Asset persistence and delivery

### 1.2 Level 2: Container Diagram

```mermaid
C4Container
    title Container Diagram - Branding OS

    Person(user, "User", "Content creator")

    Container_Boundary(brandingos, "Branding OS") {
        Container(web, "Web Application", "React 18 + TypeScript", "Single-page application")
        Container(api, "API Server", "Node.js + Express", "RESTful API")
        Container(agents, "Agent Orchestrator", "TypeScript", "Multi-agent system")
        Container(db, "Database", "SQLite/PostgreSQL", "Relational database")
        Container(cache, "Cache", "In-memory", "Response cache")
    }

    System_Ext(gemini, "Gemini API", "AI text generation")
    System_Ext(imagen, "Imagen API", "AI image generation")

    Rel(user, web, "Uses", "HTTPS")
    Rel(web, api, "API calls", "JSON/HTTPS")
    Rel(api, agents, "Orchestrates", "Function calls")
    Rel(agents, db, "Reads/Writes", "SQL")
    Rel(agents, cache, "Caches", "Memory")
    Rel(agents, gemini, "Generate text", "REST API")
    Rel(agents, imagen, "Generate images", "REST API")
    Rel(api, db, "Query", "SQL")
```

**Container Responsibilities:**
- **Web Application**: User interface, routing, state management
- **API Server**: Request handling, authentication, validation
- **Agent Orchestrator**: Multi-agent workflow execution
- **Database**: Persistent storage for brands, assets, templates
- **Cache**: Performance optimization for repeated queries

### 1.3 Level 3: Component Diagram

```mermaid
C4Component
    title Component Diagram - Agent Orchestrator

    Container_Boundary(orchestrator, "Agent Orchestrator") {
        Component(workflow, "Workflow Engine", "TypeScript", "Coordinates agent execution")
        Component(analyzer, "Analyzer Agent", "Gemini", "Extract context")
        Component(strategist, "Strategist Agent", "Gemini", "Define approach")
        Component(copywriter, "Copywriter Agent", "Gemini", "Generate text")
        Component(visual, "Visual Director", "Gemini", "Define visuals")
        Component(composer, "Composer Agent", "Imagen + Code", "Create final asset")
        Component(quality, "Quality Gate", "Validation Engine", "Ensure compliance")
    }

    Container(db, "Database", "SQLite/PostgreSQL")
    System_Ext(gemini, "Gemini API")
    System_Ext(imagen, "Imagen API")

    Rel(workflow, analyzer, "Step 1")
    Rel(analyzer, strategist, "Context")
    Rel(strategist, copywriter, "Strategy")
    Rel(copywriter, visual, "Copy")
    Rel(visual, composer, "Visual spec")
    Rel(composer, quality, "Asset")
    Rel(quality, workflow, "Result")

    Rel(analyzer, db, "Load brand")
    Rel(analyzer, gemini, "Analyze")
    Rel(strategist, gemini, "Plan")
    Rel(copywriter, gemini, "Write")
    Rel(visual, gemini, "Design")
    Rel(composer, imagen, "Generate")
    Rel(quality, db, "Validate")
```

---

## 2. Technology Stack

### 2.1 Frontend Stack

```typescript
{
  "core": {
    "framework": "React 18",
    "language": "TypeScript 5.3+",
    "buildTool": "Vite 5",
    "styling": "Tailwind CSS 4"
  },
  "stateManagement": {
    "global": "Zustand",
    "server": "TanStack Query (React Query)",
    "forms": "React Hook Form"
  },
  "routing": {
    "library": "React Router 6",
    "type": "Client-side routing"
  },
  "uiComponents": {
    "base": "shadcn/ui",
    "icons": "Lucide React",
    "animations": "Framer Motion"
  }
}
```

### 2.2 Backend Stack

```typescript
{
  "runtime": "Node.js 20+",
  "framework": "Express.js",
  "language": "TypeScript",
  "validation": "Zod",
  "orm": "Drizzle ORM",
  "database": {
    "mvp": "SQLite",
    "production": "PostgreSQL 15+"
  }
}
```

### 2.3 AI Stack

```typescript
{
  "textGeneration": {
    "provider": "Google AI Studio",
    "model": "gemini-2.5-pro-latest",
    "features": ["thinking", "reasoning", "multimodal"]
  },
  "imageGeneration": {
    "provider": "Google Cloud",
    "model": "imagen-3.0-generate-001",
    "outputFormat": "PNG"
  },
  "orchestration": {
    "pattern": "Sequential multi-agent",
    "errorHandling": "Retry with backoff",
    "caching": "In-memory LRU"
  }
}
```

### 2.4 Deployment Stack

```typescript
{
  "hosting": {
    "platform": "Vercel",
    "region": "US East",
    "framework": "Vite"
  },
  "cicd": {
    "provider": "GitHub Actions",
    "triggers": ["push", "pull_request"],
    "stages": ["lint", "typecheck", "build", "deploy"]
  },
  "monitoring": {
    "errors": "Vercel Analytics",
    "performance": "Web Vitals",
    "logs": "Vercel Logs"
  }
}
```

---

## 3. Multi-Agent System Architecture

### 3.1 Agent Overview

The Branding OS uses a **sequential multi-agent pipeline** where each agent has a specialized role and passes enriched context to the next agent.

```mermaid
graph TD
    A[User Request] --> B[Agent 1: Analyzer]
    B --> C[Agent 2: Strategist]
    C --> D[Agent 3: Copywriter]
    D --> E[Agent 4: Visual Director]
    E --> F[Agent 5: Composer]
    F --> G[Agent 6: Quality Gate]
    G --> H{Pass?}
    H -->|Yes| I[Final Asset]
    H -->|No| J[Revision Loop]
    J --> C
```

### 3.2 Agent Specifications

#### Agent 1: Analyzer

```typescript
{
  name: "Analyzer",
  purpose: "Extract context and requirements from user input",
  model: "gemini-2.5-pro-latest",
  input: {
    userRequest: string,
    brandConfig: BrandConfig,
    campaignContext?: Campaign
  },
  output: {
    assetType: "post" | "story" | "carousel" | "banner",
    platform: "instagram" | "linkedin" | "facebook",
    objective: string,
    keyMessages: string[],
    targetAudience: AudienceSegment,
    tone: ToneProfile,
    constraints: Constraint[]
  },
  systemPrompt: `
    You are the Analyzer agent. Your role is to deeply understand
    the user's request and extract structured requirements.

    Always consider:
    - Brand identity constraints
    - Platform specifications
    - Campaign objectives
    - Audience preferences
  `
}
```

#### Agent 2: Strategist

```typescript
{
  name: "Strategist",
  purpose: "Define creative approach and content strategy",
  model: "gemini-2.5-pro-latest",
  input: {
    analysisResult: AnalyzerOutput,
    brandConfig: BrandConfig,
    templates: Template[],
    previousAssets?: Asset[]
  },
  output: {
    approach: "education" | "inspiration" | "promotion" | "engagement",
    structure: ContentStructure,
    copyAngle: string,
    visualStyle: VisualStyle,
    templateRecommendation: string,
    ctaStrategy: CTAStrategy
  },
  systemPrompt: `
    You are the Strategist agent. Your role is to define the optimal
    creative approach based on the analysis.

    Consider:
    - Brand positioning
    - Audience psychology
    - Platform best practices
    - Campaign coherence
  `
}
```

#### Agent 3: Copywriter

```typescript
{
  name: "Copywriter",
  purpose: "Generate compelling, on-brand copy",
  model: "gemini-2.5-pro-latest",
  input: {
    strategy: StrategistOutput,
    brandVoice: VoiceProfile,
    copyPatterns: Pattern[],
    antiPatterns: AntiPattern[]
  },
  output: {
    headline: string,
    body: string,
    cta: string,
    hashtags?: string[],
    variations?: CopyVariation[]
  },
  systemPrompt: `
    You are the Copywriter agent. Your role is to write persuasive
    copy that aligns with the brand voice and strategy.

    Must follow:
    - Brand voice guidelines
    - Copy patterns (dos)
    - Anti-patterns (don'ts)
    - Character limits
  `
}
```

#### Agent 4: Visual Director

```typescript
{
  name: "Visual Director",
  purpose: "Define visual composition and image generation prompts",
  model: "gemini-2.5-pro-latest",
  input: {
    strategy: StrategistOutput,
    copy: CopywriterOutput,
    brandVisuals: VisualIdentity,
    layoutTemplate: Template
  },
  output: {
    imagePrompt: string,
    composition: LayoutSpec,
    colorPalette: Color[],
    typography: TypographySpec,
    imageStyle: ImageStyle
  },
  systemPrompt: `
    You are the Visual Director agent. Your role is to define the
    visual execution that brings the copy and strategy to life.

    Ensure:
    - Visual brand consistency
    - Image-copy harmony
    - Platform specifications
    - Accessibility standards
  `
}
```

#### Agent 5: Composer

```typescript
{
  name: "Composer",
  purpose: "Generate final asset combining all elements",
  model: "imagen-3.0-generate-001 + Code",
  input: {
    copy: CopywriterOutput,
    visualSpec: VisualDirectorOutput,
    template: Template,
    brandAssets: Asset[]
  },
  output: {
    assetUrl: string,
    format: "png" | "jpg" | "svg",
    dimensions: { width: number, height: number },
    metadata: AssetMetadata
  },
  process: [
    "1. Generate base image via Imagen API",
    "2. Apply brand overlays (logo, colors)",
    "3. Compose text layers",
    "4. Apply template layout",
    "5. Export final asset"
  ]
}
```

#### Agent 6: Quality Gate

```typescript
{
  name: "Quality Gate",
  purpose: "Validate asset compliance and quality",
  model: "Rule-based validation engine",
  input: {
    asset: ComposerOutput,
    brandConfig: BrandConfig,
    strategy: StrategistOutput,
    validationRules: ValidationRule[]
  },
  output: {
    passed: boolean,
    score: number,
    violations: Violation[],
    suggestions: Suggestion[]
  },
  checks: [
    "Brand color compliance",
    "Typography standards",
    "Copy pattern adherence",
    "Anti-pattern avoidance",
    "Platform specifications",
    "Accessibility (contrast, readability)",
    "Legal compliance (disclaimers, copyright)"
  ]
}
```

### 3.3 Agent Orchestration Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant Orchestrator
    participant Analyzer
    participant Strategist
    participant Copywriter
    participant Visual
    participant Composer
    participant Quality
    participant DB

    User->>API: POST /api/generate
    API->>Orchestrator: Start workflow

    Orchestrator->>DB: Load brand config
    DB-->>Orchestrator: Brand data

    Orchestrator->>Analyzer: Analyze request
    Analyzer->>Gemini: Extract context
    Gemini-->>Analyzer: Analysis
    Analyzer-->>Orchestrator: Context

    Orchestrator->>Strategist: Define strategy
    Strategist->>Gemini: Plan approach
    Gemini-->>Strategist: Strategy
    Strategist-->>Orchestrator: Strategy

    Orchestrator->>Copywriter: Write copy
    Copywriter->>Gemini: Generate text
    Gemini-->>Copywriter: Copy
    Copywriter-->>Orchestrator: Copy

    Orchestrator->>Visual: Define visuals
    Visual->>Gemini: Design spec
    Gemini-->>Visual: Visual plan
    Visual-->>Orchestrator: Visual spec

    Orchestrator->>Composer: Compose asset
    Composer->>Imagen: Generate image
    Imagen-->>Composer: Image
    Composer-->>Orchestrator: Final asset

    Orchestrator->>Quality: Validate
    Quality->>DB: Check rules
    DB-->>Quality: Validation rules
    Quality-->>Orchestrator: Result

    alt Validation passed
        Orchestrator->>DB: Save asset
        Orchestrator->>API: Success
        API->>User: Asset URL
    else Validation failed
        Orchestrator->>Strategist: Revise (loop)
    end
```

---

## 4. Data Architecture

### 4.1 Database Schema

```mermaid
erDiagram
    USERS ||--o{ BRANDS : owns
    BRANDS ||--o{ PRODUCTS : has
    BRANDS ||--o{ CAMPAIGNS : runs
    BRANDS ||--o{ TEMPLATES : uses
    BRANDS ||--o{ ASSETS : generates
    CAMPAIGNS ||--o{ ASSETS : contains
    TEMPLATES ||--o{ ASSETS : based_on

    USERS {
        uuid id PK
        string email UK
        string name
        string password_hash
        timestamp created_at
        timestamp updated_at
    }

    BRANDS {
        uuid id PK
        uuid user_id FK
        string name
        string slug UK
        jsonb brand_config
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        uuid id PK
        uuid brand_id FK
        string name
        string description
        jsonb features
        decimal price
        timestamp created_at
    }

    CAMPAIGNS {
        uuid id PK
        uuid brand_id FK
        string name
        string objective
        date start_date
        date end_date
        string status
        timestamp created_at
    }

    TEMPLATES {
        uuid id PK
        uuid brand_id FK
        string name
        string type
        jsonb layout_spec
        jsonb variables
        timestamp created_at
    }

    ASSETS {
        uuid id PK
        uuid brand_id FK
        uuid campaign_id FK
        uuid template_id FK
        string type
        string url
        jsonb metadata
        float quality_score
        timestamp created_at
    }
```

### 4.2 Core Tables Specification

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### Brands Table

```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    brand_config JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_brands_slug ON brands(slug);
```

**brand_config JSONB structure:**

```typescript
interface BrandConfig {
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
    primaryColors: Color[];
    secondaryColors: Color[];
    typography: {
      heading: Font;
      body: Font;
    };
    logoUrl: string;
    imageStyle: string;
  };
  audience: {
    segments: AudienceSegment[];
    painPoints: string[];
    desires: string[];
  };
}
```

#### Products Table

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    features JSONB,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_brand_id ON products(brand_id);
```

#### Campaigns Table

```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    objective TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
```

#### Templates Table

```sql
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    layout_spec JSONB NOT NULL,
    variables JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_brand_id ON templates(brand_id);
CREATE INDEX idx_templates_type ON templates(type);
```

#### Assets Table

```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    metadata JSONB,
    quality_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assets_brand_id ON assets(brand_id);
CREATE INDEX idx_assets_campaign_id ON assets(campaign_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_created_at ON assets(created_at DESC);
```

**metadata JSONB structure:**

```typescript
interface AssetMetadata {
  generationContext: {
    userRequest: string;
    agentOutputs: Record<string, any>;
  };
  specifications: {
    platform: string;
    dimensions: { width: number; height: number };
    format: string;
  };
  content: {
    headline: string;
    body: string;
    cta: string;
    hashtags?: string[];
  };
  validation: {
    score: number;
    violations: Violation[];
  };
}
```

---

## 5. API Design

### 5.1 API Architecture

```typescript
// Base URL: https://brandingos.vercel.app/api

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
  };
}
```

### 5.2 Core Endpoints

#### POST /api/generate

Generate a new brand asset using the multi-agent pipeline.

```typescript
// Request
interface GenerateAssetRequest {
  brandId: string;
  campaignId?: string;
  request: string; // Natural language request
  assetType?: "post" | "story" | "carousel" | "banner";
  platform?: "instagram" | "linkedin" | "facebook";
  templateId?: string;
}

// Response
interface GenerateAssetResponse {
  assetId: string;
  url: string;
  type: string;
  metadata: AssetMetadata;
  qualityScore: number;
}

// Example
POST /api/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "brandId": "123e4567-e89b-12d3-a456-426614174000",
  "request": "Create an Instagram post announcing our new feature launch",
  "platform": "instagram"
}

// Response
{
  "success": true,
  "data": {
    "assetId": "asset-uuid",
    "url": "https://storage.brandingos.com/assets/...",
    "type": "post",
    "metadata": { ... },
    "qualityScore": 0.92
  }
}
```

#### GET /api/assets

List assets with filtering and pagination.

```typescript
interface ListAssetsRequest {
  brandId?: string;
  campaignId?: string;
  type?: string;
  limit?: number;
  offset?: number;
  sortBy?: "created_at" | "quality_score";
  order?: "asc" | "desc";
}

interface ListAssetsResponse {
  assets: Asset[];
  total: number;
  limit: number;
  offset: number;
}

// Example
GET /api/assets?brandId=<uuid>&limit=20&sortBy=created_at&order=desc
```

#### GET /api/assets/:id

Get a specific asset by ID.

```typescript
interface GetAssetResponse {
  id: string;
  brandId: string;
  campaignId?: string;
  type: string;
  url: string;
  metadata: AssetMetadata;
  qualityScore: number;
  createdAt: string;
}

// Example
GET /api/assets/asset-uuid
```

#### POST /api/export

Export asset in different formats.

```typescript
interface ExportAssetRequest {
  assetId: string;
  format: "png" | "jpg" | "svg" | "pdf";
  options?: {
    quality?: number;
    scale?: number;
  };
}

interface ExportAssetResponse {
  downloadUrl: string;
  expiresAt: string;
}
```

#### GET /api/brand-config/:brandId

Get brand configuration.

```typescript
interface GetBrandConfigResponse {
  id: string;
  name: string;
  slug: string;
  config: BrandConfig;
  createdAt: string;
  updatedAt: string;
}

// Example
GET /api/brand-config/brand-uuid
```

#### PUT /api/brand-config/:brandId

Update brand configuration.

```typescript
interface UpdateBrandConfigRequest {
  config: Partial<BrandConfig>;
}

interface UpdateBrandConfigResponse {
  id: string;
  config: BrandConfig;
  updatedAt: string;
}
```

#### GET /api/templates

List available templates.

```typescript
interface ListTemplatesRequest {
  brandId?: string;
  type?: "copy" | "layout" | "full";
}

interface ListTemplatesResponse {
  templates: Template[];
  total: number;
}
```

#### POST /api/templates

Create a new template.

```typescript
interface CreateTemplateRequest {
  brandId?: string;
  name: string;
  type: "copy" | "layout" | "full";
  layoutSpec: LayoutSpec;
  variables: Variable[];
}

interface CreateTemplateResponse {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}
```

### 5.3 Authentication

```typescript
// JWT-based authentication
interface AuthToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Headers
Authorization: Bearer <jwt-token>

// Token refresh endpoint
POST /api/auth/refresh
{
  "refreshToken": "<refresh-token>"
}
```

---

## 6. Frontend Architecture

### 6.1 Component Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── brand/                   # Brand management
│   │   ├── BrandSelector.tsx
│   │   ├── BrandConfigForm.tsx
│   │   └── VoiceEditor.tsx
│   ├── generation/              # Asset generation
│   │   ├── GenerationForm.tsx
│   │   ├── AssetPreview.tsx
│   │   └── GenerationProgress.tsx
│   ├── assets/                  # Asset management
│   │   ├── AssetGrid.tsx
│   │   ├── AssetCard.tsx
│   │   └── AssetExport.tsx
│   └── templates/               # Template management
│       ├── TemplateLibrary.tsx
│       └── TemplateEditor.tsx
```

### 6.2 State Management

#### Zustand Stores

```typescript
// stores/brandStore.ts
interface BrandStore {
  currentBrand: Brand | null;
  brands: Brand[];
  setCurrentBrand: (brand: Brand) => void;
  loadBrands: () => Promise<void>;
  updateBrandConfig: (config: Partial<BrandConfig>) => Promise<void>;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  currentBrand: null,
  brands: [],
  setCurrentBrand: (brand) => set({ currentBrand: brand }),
  loadBrands: async () => {
    const brands = await fetchBrands();
    set({ brands });
  },
  updateBrandConfig: async (config) => {
    const { currentBrand } = get();
    if (!currentBrand) return;

    const updated = await updateBrandConfig(currentBrand.id, config);
    set({ currentBrand: updated });
  }
}));

// stores/generationStore.ts
interface GenerationStore {
  isGenerating: boolean;
  currentAsset: Asset | null;
  progress: GenerationProgress;
  generate: (request: GenerateAssetRequest) => Promise<Asset>;
  reset: () => void;
}

// stores/assetStore.ts
interface AssetStore {
  assets: Asset[];
  selectedAsset: Asset | null;
  filters: AssetFilters;
  loadAssets: (filters?: AssetFilters) => Promise<void>;
  selectAsset: (asset: Asset) => void;
}
```

#### React Query Usage

```typescript
// hooks/useAssets.ts
export function useAssets(brandId: string) {
  return useQuery({
    queryKey: ['assets', brandId],
    queryFn: () => fetchAssets(brandId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// hooks/useGenerateAsset.ts
export function useGenerateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: GenerateAssetRequest) => generateAsset(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}
```

### 6.3 Routing

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="generate" element={<GeneratePage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="assets/:id" element={<AssetDetailPage />} />
          <Route path="brand" element={<BrandConfigPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 6.4 Key Components

#### GenerationForm Component

```typescript
// components/generation/GenerationForm.tsx
export function GenerationForm() {
  const { currentBrand } = useBrandStore();
  const { mutate: generate, isPending } = useGenerateAsset();
  const { register, handleSubmit } = useForm<GenerateFormData>();

  const onSubmit = (data: GenerateFormData) => {
    generate({
      brandId: currentBrand!.id,
      request: data.request,
      platform: data.platform,
      assetType: data.assetType,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register('request')}
        placeholder="Describe the asset you want to create..."
      />
      <Select {...register('platform')}>
        <option value="instagram">Instagram</option>
        <option value="linkedin">LinkedIn</option>
        <option value="facebook">Facebook</option>
      </Select>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Generating...' : 'Generate Asset'}
      </Button>
    </form>
  );
}
```

---

## 7. Brand Knowledge Store

### 7.1 Storage Architecture

Brand configuration is stored as a **JSONB column** in PostgreSQL, enabling:
- Flexible schema evolution
- Efficient querying with GIN indexes
- Validation at application layer

```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY,
    brand_config JSONB NOT NULL,
    -- ... other columns
);

-- Index for fast JSONB queries
CREATE INDEX idx_brands_config_gin ON brands USING GIN (brand_config);

-- Example query: Find brands with specific voice tone
SELECT * FROM brands
WHERE brand_config @> '{"voice": {"tone": ["professional"]}}';
```

### 7.2 Brand Config Schema

```typescript
// lib/schemas/brandConfig.ts
import { z } from 'zod';

export const ColorSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  usage: z.string(),
});

export const FontSchema = z.object({
  family: z.string(),
  weights: z.array(z.number()),
  fallback: z.string(),
});

export const VoiceProfileSchema = z.object({
  tone: z.array(z.string()),
  language: z.string(),
  style: z.string(),
  doPatterns: z.array(z.string()),
  dontPatterns: z.array(z.string()),
});

export const BrandConfigSchema = z.object({
  identity: z.object({
    mission: z.string().min(10),
    vision: z.string().min(10),
    values: z.array(z.string()).min(1),
    personality: z.array(z.string()).min(1),
  }),
  voice: VoiceProfileSchema,
  visuals: z.object({
    primaryColors: z.array(ColorSchema).min(1),
    secondaryColors: z.array(ColorSchema),
    typography: z.object({
      heading: FontSchema,
      body: FontSchema,
    }),
    logoUrl: z.string().url(),
    imageStyle: z.string(),
  }),
  audience: z.object({
    segments: z.array(z.object({
      name: z.string(),
      demographics: z.string(),
      psychographics: z.string(),
      painPoints: z.array(z.string()),
      desires: z.array(z.string()),
    })),
    painPoints: z.array(z.string()),
    desires: z.array(z.string()),
  }),
});

export type BrandConfig = z.infer<typeof BrandConfigSchema>;
```

### 7.3 Pattern/Anti-Pattern Engine

```typescript
// lib/patterns/validator.ts
export class PatternValidator {
  validateCopy(copy: string, patterns: string[], antiPatterns: string[]): ValidationResult {
    const violations: Violation[] = [];
    const matches: Match[] = [];

    // Check anti-patterns (violations)
    for (const antiPattern of antiPatterns) {
      const regex = this.compilePattern(antiPattern);
      const found = copy.match(regex);
      if (found) {
        violations.push({
          type: 'anti-pattern',
          pattern: antiPattern,
          match: found[0],
          severity: 'high',
        });
      }
    }

    // Check patterns (good matches)
    for (const pattern of patterns) {
      const regex = this.compilePattern(pattern);
      const found = copy.match(regex);
      if (found) {
        matches.push({
          pattern,
          match: found[0],
        });
      }
    }

    return {
      valid: violations.length === 0,
      violations,
      matches,
      score: this.calculateScore(matches.length, violations.length),
    };
  }

  private compilePattern(pattern: string): RegExp {
    // Smart pattern compilation
    // Supports: literal strings, wildcards, regex
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      return new RegExp(pattern.slice(1, -1), 'i');
    }
    // Escape and create literal match
    return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }

  private calculateScore(matches: number, violations: number): number {
    const baseScore = 0.5;
    const matchBonus = matches * 0.1;
    const violationPenalty = violations * 0.2;
    return Math.max(0, Math.min(1, baseScore + matchBonus - violationPenalty));
  }
}
```

### 7.4 Example Brand Config

```typescript
const exampleBrandConfig: BrandConfig = {
  identity: {
    mission: "Empower creators to build authentic brands with AI assistance",
    vision: "A world where every creator has professional-grade branding",
    values: ["Authenticity", "Creativity", "Accessibility", "Quality"],
    personality: ["Innovative", "Friendly", "Professional", "Empowering"],
  },
  voice: {
    tone: ["Professional", "Encouraging", "Clear"],
    language: "en-US",
    style: "Conversational yet authoritative",
    doPatterns: [
      "Use active voice",
      "Start with benefits",
      "Include clear CTAs",
      "Use power words: transform, discover, unlock",
    ],
    dontPatterns: [
      "Avoid jargon",
      "Never use all caps (except acronyms)",
      "Don't oversell or use hype",
      "Avoid passive voice",
    ],
  },
  visuals: {
    primaryColors: [
      { name: "Brand Blue", hex: "#2563EB", usage: "Primary actions, headers" },
      { name: "Neutral Dark", hex: "#1F2937", usage: "Text, backgrounds" },
    ],
    secondaryColors: [
      { name: "Accent Orange", hex: "#F59E0B", usage: "CTAs, highlights" },
      { name: "Light Gray", hex: "#F3F4F6", usage: "Backgrounds, dividers" },
    ],
    typography: {
      heading: {
        family: "Inter",
        weights: [600, 700, 800],
        fallback: "sans-serif",
      },
      body: {
        family: "Inter",
        weights: [400, 500],
        fallback: "sans-serif",
      },
    },
    logoUrl: "https://brandingos.com/logo.svg",
    imageStyle: "Modern, clean, professional photography with vibrant colors",
  },
  audience: {
    segments: [
      {
        name: "Solo Creators",
        demographics: "25-40, digital natives, content creators",
        psychographics: "Value efficiency, quality, and authenticity",
        painPoints: ["No design skills", "Time constraints", "Inconsistent branding"],
        desires: ["Professional brand", "Time savings", "Easy to use"],
      },
    ],
    painPoints: ["Design complexity", "Brand inconsistency", "High costs"],
    desires: ["Professional quality", "Speed", "Ease of use"],
  },
};
```

---

## 8. Template Engine

### 8.1 Template Types

Branding OS supports **three template types**, each offering different levels of customization:

```typescript
type TemplateType = "copy" | "layout" | "full";

interface Template {
  id: string;
  name: string;
  type: TemplateType;
  layoutSpec: LayoutSpec;
  variables: Variable[];
}
```

#### 1. Copy Templates

**Purpose:** Structured text templates with variable substitution.

```typescript
interface CopyTemplate extends Template {
  type: "copy";
  structure: {
    headline: string;        // e.g., "{{benefit}} in {{timeframe}}"
    body: string[];          // Array of body text templates
    cta: string;             // e.g., "{{action}} now"
  };
  variables: {
    benefit: string;
    timeframe: string;
    action: string;
  };
}

// Example
const promoTemplate: CopyTemplate = {
  id: "promo-01",
  name: "Product Launch Announcement",
  type: "copy",
  structure: {
    headline: "Introducing {{productName}} - {{benefit}}",
    body: [
      "We're excited to announce {{productName}}, designed to {{primaryBenefit}}.",
      "Key features:",
      "{{feature1}}",
      "{{feature2}}",
      "{{feature3}}",
    ],
    cta: "{{action}} today",
  },
  variables: {
    productName: "",
    benefit: "",
    primaryBenefit: "",
    feature1: "",
    feature2: "",
    feature3: "",
    action: "Get started",
  },
};
```

#### 2. Layout Templates

**Purpose:** Visual composition templates defining element placement.

```typescript
interface LayoutTemplate extends Template {
  type: "layout";
  dimensions: { width: number; height: number };
  layers: Layer[];
}

interface Layer {
  id: string;
  type: "image" | "text" | "shape" | "logo";
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: LayerStyle;
  content?: string; // Variable placeholder
}

// Example
const instagramPostLayout: LayoutTemplate = {
  id: "ig-post-01",
  name: "Instagram Post - Feature Highlight",
  type: "layout",
  dimensions: { width: 1080, height: 1080 },
  layers: [
    {
      id: "background",
      type: "image",
      position: { x: 0, y: 0 },
      size: { width: 1080, height: 1080 },
      style: { opacity: 0.9 },
      content: "{{backgroundImage}}",
    },
    {
      id: "headline",
      type: "text",
      position: { x: 60, y: 120 },
      size: { width: 960, height: 200 },
      style: {
        fontSize: 64,
        fontWeight: 800,
        color: "{{primaryColor}}",
        textAlign: "center",
      },
      content: "{{headline}}",
    },
    {
      id: "body",
      type: "text",
      position: { x: 60, y: 360 },
      size: { width: 960, height: 400 },
      style: {
        fontSize: 32,
        fontWeight: 400,
        color: "#1F2937",
        textAlign: "center",
        lineHeight: 1.5,
      },
      content: "{{body}}",
    },
    {
      id: "logo",
      type: "logo",
      position: { x: 860, y: 920 },
      size: { width: 160, height: 80 },
      style: {},
      content: "{{logoUrl}}",
    },
  ],
};
```

#### 3. Full Templates

**Purpose:** Complete asset templates combining copy and layout.

```typescript
interface FullTemplate extends Template {
  type: "full";
  copy: CopyTemplate;
  layout: LayoutTemplate;
  mapping: VariableMapping; // Maps copy vars to layout vars
}

// Example
const fullProductLaunchTemplate: FullTemplate = {
  id: "full-product-launch",
  name: "Complete Product Launch Post",
  type: "full",
  copy: promoTemplate,
  layout: instagramPostLayout,
  mapping: {
    "copy.headline": "layout.headline",
    "copy.body": "layout.body",
    "brand.logoUrl": "layout.logoUrl",
    "brand.primaryColor": "layout.primaryColor",
  },
};
```

### 8.2 Variable System

```typescript
interface Variable {
  name: string;
  type: "text" | "image" | "color" | "number";
  source: "user" | "brand" | "product" | "generated";
  defaultValue?: any;
  required: boolean;
  validation?: ValidationRule;
}

// Variable resolution order:
// 1. User input
// 2. Brand config
// 3. Product data
// 4. AI-generated
// 5. Default value

class VariableResolver {
  resolve(variable: Variable, context: ResolverContext): any {
    // User-provided value
    if (context.userInput[variable.name]) {
      return context.userInput[variable.name];
    }

    // Brand config value
    if (variable.source === "brand") {
      return this.extractFromBrand(variable.name, context.brandConfig);
    }

    // Product data value
    if (variable.source === "product") {
      return this.extractFromProduct(variable.name, context.product);
    }

    // AI-generated value
    if (variable.source === "generated") {
      return context.generatedValues[variable.name];
    }

    // Default value
    return variable.defaultValue;
  }
}
```

### 8.3 Rendering Pipeline

```mermaid
graph LR
    A[Template] --> B[Resolve Variables]
    B --> C[Apply Copy Template]
    C --> D[Apply Layout Template]
    D --> E[Generate Image Layers]
    E --> F[Compose Final Asset]
    F --> G[Export]

    B --> B1[User Input]
    B --> B2[Brand Config]
    B --> B3[AI Generation]
```

```typescript
class TemplateRenderer {
  async render(template: Template, context: RenderContext): Promise<Asset> {
    // Step 1: Resolve all variables
    const resolvedVars = await this.resolveVariables(template.variables, context);

    // Step 2: Apply copy template
    const copy = this.applyCopyTemplate(template.copy, resolvedVars);

    // Step 3: Apply layout template
    const layout = this.applyLayoutTemplate(template.layout, {
      ...resolvedVars,
      ...copy,
    });

    // Step 4: Generate image layers
    const layers = await this.generateLayers(layout.layers);

    // Step 5: Compose final asset
    const asset = await this.composeAsset(layers, layout.dimensions);

    return asset;
  }

  private async generateLayers(layers: Layer[]): Promise<RenderedLayer[]> {
    return Promise.all(
      layers.map(async (layer) => {
        switch (layer.type) {
          case "image":
            return this.renderImageLayer(layer);
          case "text":
            return this.renderTextLayer(layer);
          case "logo":
            return this.renderLogoLayer(layer);
          default:
            return this.renderShapeLayer(layer);
        }
      })
    );
  }
}
```

---

## 9. Quality Gate System

### 9.1 Validation Architecture

The Quality Gate ensures every asset meets brand standards before delivery.

```typescript
interface ValidationRule {
  id: string;
  name: string;
  category: "brand" | "platform" | "accessibility" | "legal";
  severity: "error" | "warning" | "info";
  validator: (asset: Asset, context: ValidationContext) => ValidationResult;
}

interface ValidationResult {
  passed: boolean;
  score: number;
  violations: Violation[];
  suggestions: Suggestion[];
}

interface Violation {
  ruleId: string;
  severity: "error" | "warning" | "info";
  message: string;
  location?: string;
}
```

### 9.2 Validation Rules

#### Brand Compliance Rules

```typescript
const brandColorRule: ValidationRule = {
  id: "brand-color-compliance",
  name: "Brand Color Compliance",
  category: "brand",
  severity: "error",
  validator: (asset, context) => {
    const usedColors = extractColors(asset);
    const allowedColors = [
      ...context.brandConfig.visuals.primaryColors,
      ...context.brandConfig.visuals.secondaryColors,
    ].map(c => c.hex);

    const violations = usedColors.filter(color => {
      return !allowedColors.some(allowed =>
        colorDistance(color, allowed) < 10 // Allow slight variations
      );
    });

    return {
      passed: violations.length === 0,
      score: 1 - (violations.length / usedColors.length),
      violations: violations.map(color => ({
        ruleId: "brand-color-compliance",
        severity: "error",
        message: `Unauthorized color ${color} detected`,
        location: "visual",
      })),
      suggestions: [],
    };
  },
};

const voicePatternRule: ValidationRule = {
  id: "voice-pattern-compliance",
  name: "Voice Pattern Compliance",
  category: "brand",
  severity: "warning",
  validator: (asset, context) => {
    const copy = extractCopy(asset);
    const patterns = context.brandConfig.voice.doPatterns;
    const antiPatterns = context.brandConfig.voice.dontPatterns;

    const patternValidator = new PatternValidator();
    return patternValidator.validateCopy(copy, patterns, antiPatterns);
  },
};
```

#### Platform Rules

```typescript
const instagramDimensionsRule: ValidationRule = {
  id: "instagram-dimensions",
  name: "Instagram Dimensions",
  category: "platform",
  severity: "error",
  validator: (asset, context) => {
    if (context.platform !== "instagram") {
      return { passed: true, score: 1, violations: [], suggestions: [] };
    }

    const { width, height } = asset.dimensions;
    const aspectRatio = width / height;

    const validRatios = {
      post: [1, 4/5, 1.91],
      story: [9/16],
      carousel: [1],
    };

    const allowed = validRatios[asset.type] || [1];
    const isValid = allowed.some(ratio =>
      Math.abs(aspectRatio - ratio) < 0.01
    );

    return {
      passed: isValid,
      score: isValid ? 1 : 0,
      violations: isValid ? [] : [{
        ruleId: "instagram-dimensions",
        severity: "error",
        message: `Invalid aspect ratio ${aspectRatio.toFixed(2)} for ${asset.type}`,
        location: "dimensions",
      }],
      suggestions: [{
        message: `Use aspect ratio ${allowed[0]} for Instagram ${asset.type}`,
      }],
    };
  },
};
```

#### Accessibility Rules

```typescript
const contrastRule: ValidationRule = {
  id: "color-contrast",
  name: "WCAG Color Contrast",
  category: "accessibility",
  severity: "warning",
  validator: (asset, context) => {
    const textLayers = extractTextLayers(asset);
    const violations: Violation[] = [];

    for (const layer of textLayers) {
      const ratio = calculateContrastRatio(
        layer.textColor,
        layer.backgroundColor
      );

      const minRatio = layer.fontSize >= 24 ? 3 : 4.5; // WCAG AA

      if (ratio < minRatio) {
        violations.push({
          ruleId: "color-contrast",
          severity: "warning",
          message: `Low contrast ratio ${ratio.toFixed(2)} (minimum ${minRatio})`,
          location: layer.id,
        });
      }
    }

    return {
      passed: violations.length === 0,
      score: 1 - (violations.length / textLayers.length),
      violations,
      suggestions: violations.map(v => ({
        message: "Increase contrast between text and background",
      })),
    };
  },
};
```

### 9.3 Scoring Algorithm

```typescript
class QualityScorer {
  calculateScore(validationResults: ValidationResult[]): number {
    let totalScore = 0;
    let totalWeight = 0;

    const weights = {
      error: 1.0,
      warning: 0.5,
      info: 0.2,
    };

    for (const result of validationResults) {
      const rule = this.getRuleById(result.ruleId);
      const weight = weights[rule.severity];

      totalScore += result.score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  getPassThreshold(assetType: string): number {
    // Different thresholds for different asset types
    const thresholds = {
      post: 0.8,
      story: 0.75,
      carousel: 0.85,
      banner: 0.9,
    };

    return thresholds[assetType] || 0.8;
  }
}
```

### 9.4 Validation Flow

```mermaid
graph TD
    A[Asset Created] --> B[Run Validators]
    B --> C{All Rules Pass?}
    C -->|Yes| D[Calculate Score]
    C -->|No| E{Has Errors?}
    E -->|Yes| F[Reject Asset]
    E -->|No| D
    D --> G{Score >= Threshold?}
    G -->|Yes| H[Approve Asset]
    G -->|No| I[Request Revision]
    I --> J[Regenerate]
    J --> B
    F --> K[Show Violations]
    K --> L[User Decision]
    L -->|Fix| J
    L -->|Override| M[Manual Approval]
```

---

## 10. Asset Pipeline

### 10.1 End-to-End Flow

```mermaid
graph TD
    A[User Request] --> B[Agent 1: Analyzer]
    B --> C[Agent 2: Strategist]
    C --> D[Agent 3: Copywriter]
    D --> E[Agent 4: Visual Director]
    E --> F[Agent 5: Composer]
    F --> G[Agent 6: Quality Gate]
    G --> H{Validation}
    H -->|Pass| I[Save Asset]
    H -->|Fail| J[Revision Loop]
    J --> C
    I --> K[Export Options]
    K --> L[Final Delivery]
```

### 10.2 Detailed Pipeline Steps

#### Step 1: Input Processing

```typescript
interface AssetRequest {
  brandId: string;
  request: string; // Natural language
  platform?: string;
  assetType?: string;
  templateId?: string;
  campaignId?: string;
}

async function processInput(request: AssetRequest): Promise<ProcessedInput> {
  // Load brand context
  const brand = await db.brands.findById(request.brandId);
  const campaign = request.campaignId
    ? await db.campaigns.findById(request.campaignId)
    : null;

  return {
    request,
    brand,
    campaign,
    timestamp: new Date(),
  };
}
```

#### Step 2: Context Analysis

```typescript
async function analyzeContext(input: ProcessedInput): Promise<AnalysisResult> {
  const analyzer = new AnalyzerAgent();

  const result = await analyzer.analyze({
    userRequest: input.request.request,
    brandConfig: input.brand.config,
    campaignContext: input.campaign,
  });

  // Extract structured requirements
  return {
    assetType: result.assetType,
    platform: result.platform,
    objective: result.objective,
    targetAudience: result.targetAudience,
    keyMessages: result.keyMessages,
    constraints: result.constraints,
  };
}
```

#### Step 3: Strategy Definition

```typescript
async function defineStrategy(analysis: AnalysisResult): Promise<Strategy> {
  const strategist = new StrategistAgent();

  return await strategist.plan({
    analysis,
    brandConfig: input.brand.config,
    previousAssets: await loadRelevantAssets(input.brand.id),
  });
}
```

#### Step 4: Copy Generation

```typescript
async function generateCopy(strategy: Strategy): Promise<Copy> {
  const copywriter = new CopywriterAgent();

  return await copywriter.write({
    strategy,
    brandVoice: input.brand.config.voice,
    patterns: input.brand.config.voice.doPatterns,
    antiPatterns: input.brand.config.voice.dontPatterns,
  });
}
```

#### Step 5: Visual Design

```typescript
async function designVisuals(copy: Copy, strategy: Strategy): Promise<VisualSpec> {
  const visualDirector = new VisualDirectorAgent();

  return await visualDirector.design({
    copy,
    strategy,
    brandVisuals: input.brand.config.visuals,
    template: await loadTemplate(input.request.templateId),
  });
}
```

#### Step 6: Asset Composition

```typescript
async function composeAsset(
  copy: Copy,
  visualSpec: VisualSpec
): Promise<RawAsset> {
  const composer = new ComposerAgent();

  // Generate base image via Imagen
  const baseImage = await generateImage(visualSpec.imagePrompt);

  // Apply brand elements
  const brandedImage = await applyBrandOverlays(baseImage, {
    logo: input.brand.config.visuals.logoUrl,
    colors: input.brand.config.visuals.primaryColors,
  });

  // Compose text layers
  const finalAsset = await composeTextLayers(brandedImage, copy, visualSpec.layout);

  return finalAsset;
}
```

#### Step 7: Quality Validation

```typescript
async function validateAsset(asset: RawAsset): Promise<ValidationResult> {
  const qualityGate = new QualityGateAgent();

  const result = await qualityGate.validate({
    asset,
    brandConfig: input.brand.config,
    strategy,
    rules: await loadValidationRules(input.brand.id),
  });

  if (!result.passed) {
    // Revision loop
    if (result.violations.some(v => v.severity === "error")) {
      throw new ValidationError("Asset has critical violations", result);
    }
  }

  return result;
}
```

#### Step 8: Export & Delivery

```typescript
async function exportAsset(
  asset: RawAsset,
  validation: ValidationResult
): Promise<FinalAsset> {
  // Save to storage
  const url = await uploadToStorage(asset);

  // Save to database
  const savedAsset = await db.assets.create({
    brandId: input.brand.id,
    campaignId: input.request.campaignId,
    type: analysis.assetType,
    url,
    metadata: {
      generationContext: {
        userRequest: input.request.request,
        agentOutputs: { analysis, strategy, copy, visualSpec },
      },
      specifications: {
        platform: analysis.platform,
        dimensions: asset.dimensions,
        format: asset.format,
      },
      content: copy,
      validation,
    },
    qualityScore: validation.score,
  });

  return savedAsset;
}
```

### 10.3 Complete Pipeline Orchestration

```typescript
export async function generateAsset(request: AssetRequest): Promise<FinalAsset> {
  try {
    // Step 1: Process input
    const input = await processInput(request);

    // Step 2: Analyze context
    const analysis = await analyzeContext(input);

    // Step 3: Define strategy
    const strategy = await defineStrategy(analysis);

    // Step 4: Generate copy
    const copy = await generateCopy(strategy);

    // Step 5: Design visuals
    const visualSpec = await designVisuals(copy, strategy);

    // Step 6: Compose asset
    const rawAsset = await composeAsset(copy, visualSpec);

    // Step 7: Validate
    const validation = await validateAsset(rawAsset);

    // Step 8: Export
    const finalAsset = await exportAsset(rawAsset, validation);

    return finalAsset;

  } catch (error) {
    if (error instanceof ValidationError) {
      // Handle validation failures
      throw new APIError(400, "Asset validation failed", error.details);
    }

    throw error;
  }
}
```

---

## 11. Folder Structure

```
branding-os/
├── src/
│   ├── agents/                     # Multi-agent system
│   │   ├── base/
│   │   │   ├── Agent.ts            # Base agent class
│   │   │   └── types.ts            # Shared types
│   │   ├── analyzer/
│   │   │   ├── AnalyzerAgent.ts
│   │   │   └── prompts.ts
│   │   ├── strategist/
│   │   │   ├── StrategistAgent.ts
│   │   │   └── prompts.ts
│   │   ├── copywriter/
│   │   │   ├── CopywriterAgent.ts
│   │   │   └── prompts.ts
│   │   ├── visual-director/
│   │   │   ├── VisualDirectorAgent.ts
│   │   │   └── prompts.ts
│   │   ├── composer/
│   │   │   ├── ComposerAgent.ts
│   │   │   └── rendering/
│   │   │       ├── ImageRenderer.ts
│   │   │       ├── TextRenderer.ts
│   │   │       └── AssetComposer.ts
│   │   ├── quality-gate/
│   │   │   ├── QualityGateAgent.ts
│   │   │   └── validators/
│   │   │       ├── BrandValidator.ts
│   │   │       ├── PlatformValidator.ts
│   │   │       ├── AccessibilityValidator.ts
│   │   │       └── index.ts
│   │   └── orchestrator/
│   │       ├── AgentOrchestrator.ts
│   │       └── pipeline.ts
│   ├── components/                 # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── Footer.tsx
│   │   ├── brand/
│   │   │   ├── BrandSelector.tsx
│   │   │   ├── BrandConfigForm.tsx
│   │   │   ├── VoiceEditor.tsx
│   │   │   ├── VisualIdentityEditor.tsx
│   │   │   └── AudienceEditor.tsx
│   │   ├── generation/
│   │   │   ├── GenerationForm.tsx
│   │   │   ├── AssetPreview.tsx
│   │   │   ├── GenerationProgress.tsx
│   │   │   └── RevisionPanel.tsx
│   │   ├── assets/
│   │   │   ├── AssetGrid.tsx
│   │   │   ├── AssetCard.tsx
│   │   │   ├── AssetDetail.tsx
│   │   │   └── AssetExport.tsx
│   │   ├── templates/
│   │   │   ├── TemplateLibrary.tsx
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── TemplateEditor.tsx
│   │   │   └── VariableEditor.tsx
│   │   └── campaigns/
│   │       ├── CampaignList.tsx
│   │       ├── CampaignForm.tsx
│   │       └── CampaignAssets.tsx
│   ├── lib/                        # Core libraries
│   │   ├── api/
│   │   │   ├── client.ts           # API client
│   │   │   └── endpoints/
│   │   │       ├── generate.ts
│   │   │       ├── assets.ts
│   │   │       ├── brands.ts
│   │   │       └── templates.ts
│   │   ├── db/
│   │   │   ├── client.ts           # Database client
│   │   │   ├── schema.ts           # Drizzle schema
│   │   │   └── migrations/
│   │   ├── ai/
│   │   │   ├── gemini.ts           # Gemini client
│   │   │   ├── imagen.ts           # Imagen client
│   │   │   └── prompts/
│   │   ├── templates/
│   │   │   ├── TemplateEngine.ts
│   │   │   ├── VariableResolver.ts
│   │   │   └── Renderer.ts
│   │   ├── validation/
│   │   │   ├── PatternValidator.ts
│   │   │   ├── QualityScorer.ts
│   │   │   └── rules/
│   │   ├── schemas/
│   │   │   ├── brandConfig.ts
│   │   │   ├── asset.ts
│   │   │   ├── template.ts
│   │   │   └── api.ts
│   │   └── utils/
│   │       ├── colors.ts
│   │       ├── images.ts
│   │       └── text.ts
│   ├── stores/                     # Zustand stores
│   │   ├── brandStore.ts
│   │   ├── generationStore.ts
│   │   ├── assetStore.ts
│   │   └── templateStore.ts
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAssets.ts
│   │   ├── useBrandConfig.ts
│   │   ├── useGenerateAsset.ts
│   │   └── useTemplates.ts
│   ├── pages/                      # Page components
│   │   ├── Dashboard.tsx
│   │   ├── GeneratePage.tsx
│   │   ├── AssetsPage.tsx
│   │   ├── AssetDetailPage.tsx
│   │   ├── BrandConfigPage.tsx
│   │   ├── TemplatesPage.tsx
│   │   ├── CampaignsPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── types/
│   │   ├── brand.ts
│   │   ├── asset.ts
│   │   ├── template.ts
│   │   ├── agent.ts
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── server/                         # Backend (if separate)
│   ├── routes/
│   │   ├── generate.ts
│   │   ├── assets.ts
│   │   ├── brands.ts
│   │   └── templates.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   └── index.ts
├── public/
│   ├── templates/                  # Default templates
│   └── assets/
├── docs/
│   ├── architecture/
│   │   └── SYSTEM-ARCHITECTURE.md  # This file
│   ├── prd/
│   │   └── PRD.md
│   └── guides/
│       ├── user-guide.md
│       └── developer-guide.md
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── README.md
```

---

## 12. Security

### 12.1 Authentication

```typescript
// JWT-based authentication
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface AuthTokenPayload {
  userId: string;
  email: string;
}

export async function login(email: string, password: string): Promise<string> {
  const user = await db.users.findByEmail(email);

  if (!user) {
    throw new AuthError('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new AuthError('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return token;
}

export function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
  } catch (error) {
    throw new AuthError('Invalid token');
  }
}
```

### 12.2 Authorization

```typescript
// Role-based access control
enum Role {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

interface Permission {
  resource: 'brand' | 'asset' | 'template';
  action: 'read' | 'write' | 'delete';
}

const rolePermissions: Record<Role, Permission[]> = {
  owner: [
    { resource: 'brand', action: 'read' },
    { resource: 'brand', action: 'write' },
    { resource: 'brand', action: 'delete' },
    { resource: 'asset', action: 'read' },
    { resource: 'asset', action: 'write' },
    { resource: 'asset', action: 'delete' },
    { resource: 'template', action: 'read' },
    { resource: 'template', action: 'write' },
    { resource: 'template', action: 'delete' },
  ],
  editor: [
    { resource: 'brand', action: 'read' },
    { resource: 'asset', action: 'read' },
    { resource: 'asset', action: 'write' },
    { resource: 'template', action: 'read' },
  ],
  viewer: [
    { resource: 'brand', action: 'read' },
    { resource: 'asset', action: 'read' },
    { resource: 'template', action: 'read' },
  ],
};

export function authorize(
  user: User,
  resource: string,
  action: string
): boolean {
  const permissions = rolePermissions[user.role];
  return permissions.some(
    p => p.resource === resource && p.action === action
  );
}
```

### 12.3 Data Privacy

```typescript
// Encryption for sensitive data
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Use for API keys, tokens, etc.
await db.brands.update(brandId, {
  apiKeys: encrypt(JSON.stringify(apiKeys)),
});
```

### 12.4 Input Validation

```typescript
import { z } from 'zod';

// Validate all user inputs
export const GenerateAssetSchema = z.object({
  brandId: z.string().uuid(),
  campaignId: z.string().uuid().optional(),
  request: z.string().min(10).max(1000),
  assetType: z.enum(['post', 'story', 'carousel', 'banner']).optional(),
  platform: z.enum(['instagram', 'linkedin', 'facebook']).optional(),
  templateId: z.string().uuid().optional(),
});

// API middleware
export async function validateRequest(
  req: Request,
  schema: z.ZodSchema
): Promise<void> {
  try {
    await schema.parseAsync(req.body);
  } catch (error) {
    throw new ValidationError('Invalid request', error);
  }
}
```

### 12.5 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});

// Generation endpoint rate limiting (more restrictive)
export const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 generations per hour
  message: 'Generation limit reached, please upgrade your plan',
});
```

---

## 13. Scalability

### 13.1 Caching Strategy

```typescript
import { LRUCache } from 'lru-cache';

// In-memory cache for brand configs
const brandConfigCache = new LRUCache<string, BrandConfig>({
  max: 500,
  ttl: 1000 * 60 * 15, // 15 minutes
});

export async function getBrandConfig(brandId: string): Promise<BrandConfig> {
  // Check cache first
  const cached = brandConfigCache.get(brandId);
  if (cached) {
    return cached;
  }

  // Load from database
  const brand = await db.brands.findById(brandId);

  // Cache for future requests
  brandConfigCache.set(brandId, brand.config);

  return brand.config;
}

// Cache invalidation
export async function updateBrandConfig(
  brandId: string,
  config: Partial<BrandConfig>
): Promise<void> {
  await db.brands.update(brandId, { config });

  // Invalidate cache
  brandConfigCache.delete(brandId);
}
```

### 13.2 Queue System

```typescript
import Bull from 'bull';

// Asset generation queue
const generationQueue = new Bull('asset-generation', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
  },
});

// Add job to queue
export async function queueAssetGeneration(
  request: GenerateAssetRequest
): Promise<string> {
  const job = await generationQueue.add('generate', request, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });

  return job.id;
}

// Process jobs
generationQueue.process('generate', async (job) => {
  const result = await generateAsset(job.data);
  return result;
});

// Job status
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const job = await generationQueue.getJob(jobId);

  if (!job) {
    throw new Error('Job not found');
  }

  return {
    id: job.id,
    status: await job.getState(),
    progress: job.progress(),
    result: job.returnvalue,
  };
}
```

### 13.3 Database Optimization

```sql
-- Indexes for common queries

-- Assets by brand and date
CREATE INDEX idx_assets_brand_created ON assets(brand_id, created_at DESC);

-- Assets by campaign
CREATE INDEX idx_assets_campaign ON assets(campaign_id) WHERE campaign_id IS NOT NULL;

-- Brand config search (PostgreSQL)
CREATE INDEX idx_brands_config_gin ON brands USING GIN (brand_config);

-- Templates by type
CREATE INDEX idx_templates_type ON templates(type, brand_id);

-- Connection pooling
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 13.4 CDN & Asset Delivery

```typescript
// Upload to CDN with optimized settings
export async function uploadAsset(
  asset: Buffer,
  metadata: AssetMetadata
): Promise<string> {
  const key = generateAssetKey(metadata);

  // Upload to S3/CloudFlare R2
  await s3.putObject({
    Bucket: process.env.ASSET_BUCKET,
    Key: key,
    Body: asset,
    ContentType: metadata.format === 'png' ? 'image/png' : 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
    Metadata: {
      brandId: metadata.brandId,
      assetType: metadata.assetType,
    },
  });

  // Return CDN URL
  return `${process.env.CDN_URL}/${key}`;
}

// Image optimization
export async function optimizeImage(
  buffer: Buffer,
  format: 'png' | 'jpg'
): Promise<Buffer> {
  const sharp = require('sharp');

  return await sharp(buffer)
    .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
    [format]({ quality: 85 })
    .toBuffer();
}
```

---

## 14. Deployment

### 14.1 Vercel Configuration

```typescript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "regions": ["iad1"],
  "env": {
    "VITE_API_URL": "@api-url",
    "VITE_GEMINI_API_KEY": "@gemini-api-key",
    "VITE_IMAGEN_API_KEY": "@imagen-api-key"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### 14.2 Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:password@host:5432/brandingos
DATABASE_POOL_SIZE=20

# Authentication
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key-hex

# AI Services
GEMINI_API_KEY=your-gemini-api-key
IMAGEN_API_KEY=your-imagen-api-key

# Storage
S3_BUCKET=brandingos-assets
S3_REGION=us-east-1
CDN_URL=https://cdn.brandingos.com

# Redis (optional, for queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
NODE_ENV=production
API_URL=https://api.brandingos.com
```

### 14.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 14.4 Database Migrations

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

// package.json scripts
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 14.5 Health Checks & Monitoring

```typescript
// API health check endpoint
app.get('/api/health', async (req, res) => {
  const checks = {
    database: false,
    gemini: false,
    imagen: false,
    storage: false,
  };

  try {
    // Check database
    await db.query('SELECT 1');
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check Gemini API
    await gemini.ping();
    checks.gemini = true;
  } catch (error) {
    console.error('Gemini health check failed:', error);
  }

  try {
    // Check Imagen API
    await imagen.ping();
    checks.imagen = true;
  } catch (error) {
    console.error('Imagen health check failed:', error);
  }

  try {
    // Check storage
    await s3.headBucket({ Bucket: process.env.ASSET_BUCKET });
    checks.storage = true;
  } catch (error) {
    console.error('Storage health check failed:', error);
  }

  const allHealthy = Object.values(checks).every(v => v);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});
```

---

## 15. Performance Benchmarks

### 15.1 Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Asset generation time | < 30s | TBD |
| API response time (p95) | < 500ms | TBD |
| Database query time (p95) | < 100ms | TBD |
| Image generation time | < 15s | TBD |
| Cache hit rate | > 80% | TBD |
| Uptime | 99.9% | TBD |

### 15.2 Load Testing

```typescript
// k6 load test script
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const res = http.post(
    'https://api.brandingos.com/api/generate',
    JSON.stringify({
      brandId: 'test-brand-id',
      request: 'Create an Instagram post about our new feature',
      platform: 'instagram',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
    }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 30s': (r) => r.timings.duration < 30000,
  });
}
```

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Agent | Specialized AI component with a specific role in the asset generation pipeline |
| Asset | Final branded output (post, story, carousel, banner, etc.) |
| Brand Config | JSON/JSONB structure containing all brand identity information |
| Composer | Agent responsible for combining all elements into final asset |
| Pattern | Approved brand voice/copy guideline |
| Anti-Pattern | Prohibited brand voice/copy guideline |
| Quality Gate | Validation system ensuring brand compliance |
| Template | Reusable structure for asset generation |
| Variable | Dynamic placeholder in templates resolved at generation time |

---

## Appendix B: API Reference

See Section 5 for complete API documentation.

---

## Appendix C: Database Schema

See Section 4 for complete database schema.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-09 | System Architect | Initial architecture document |

---

**End of System Architecture Document**
