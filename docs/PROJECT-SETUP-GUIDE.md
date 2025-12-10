# BRANDING OS - Project Setup Guide

Complete setup guide for the Branding OS multi-agent brand identity generation system.

---

## Quick Start

```bash
# Navigate to project directory
cd D:\genesis-meta-system\branding-os

# Initialize Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 1. Folder Structure

```
branding-os/
├── src/
│   ├── agents/                    # AI agent implementations
│   │   ├── base-agent.ts          # Abstract base agent class
│   │   ├── analyzer.ts            # Market & audience analysis
│   │   ├── strategist.ts          # Brand strategy & positioning
│   │   ├── copywriter.ts          # Voice & messaging
│   │   ├── visual-director.ts     # Visual identity & imagery
│   │   ├── composer.ts            # Asset composition & integration
│   │   ├── quality-gate.ts        # Brand coherence validation
│   │   └── orchestrator.ts        # Agent coordination & workflow
│   │
│   ├── components/
│   │   ├── ui/                    # Shadcn/Radix primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── progress.tsx
│   │   │   └── dialog.tsx
│   │   │
│   │   ├── wizard/                # 5-step wizard flow
│   │   │   ├── wizard-container.tsx
│   │   │   ├── step-1-input.tsx
│   │   │   ├── step-2-analysis.tsx
│   │   │   ├── step-3-strategy.tsx
│   │   │   ├── step-4-generation.tsx
│   │   │   └── step-5-review.tsx
│   │   │
│   │   ├── brand-config/          # Brand configuration
│   │   │   ├── brand-form.tsx
│   │   │   ├── style-preferences.tsx
│   │   │   └── audience-selector.tsx
│   │   │
│   │   └── asset/                 # Asset display & export
│   │       ├── brand-card.tsx
│   │       ├── asset-gallery.tsx
│   │       └── export-panel.tsx
│   │
│   ├── lib/
│   │   ├── gemini.ts              # Gemini API client
│   │   ├── imagen.ts              # Imagen API client (placeholder)
│   │   ├── db.ts                  # Database client (Drizzle ORM)
│   │   ├── schema.ts              # Database schema
│   │   ├── utils.ts               # Utility functions
│   │   └── validators.ts          # Zod schemas
│   │
│   ├── stores/                    # Zustand state management
│   │   ├── wizard-store.ts        # Wizard navigation & state
│   │   ├── brand-store.ts         # Brand identity state
│   │   └── agent-store.ts         # Agent execution state
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-wizard.ts
│   │   ├── use-brand-generation.ts
│   │   └── use-agent-orchestration.ts
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── agent.ts               # Agent interfaces
│   │   ├── brand.ts               # Brand identity types
│   │   ├── wizard.ts              # Wizard step types
│   │   └── api.ts                 # API response types
│   │
│   ├── pages/
│   │   ├── home.tsx               # Landing page
│   │   ├── wizard.tsx             # Wizard flow
│   │   └── dashboard.tsx          # Brand management
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── server/                        # Optional API server
│   ├── routes/
│   │   ├── brand.ts
│   │   └── generation.ts
│   └── index.ts
│
├── db/                            # SQLite database
│   └── branding.db
│
├── public/
│   └── assets/
│
├── docs/
│   ├── PROJECT-SETUP-GUIDE.md     # This file
│   ├── AGENT-ARCHITECTURE.md
│   └── API-REFERENCE.md
│
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 2. Dependencies

### Install All Dependencies

```bash
# Core dependencies
npm install react react-dom
npm install @google/generative-ai
npm install zustand
npm install drizzle-orm better-sqlite3
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install clsx tailwind-merge class-variance-authority

# Radix UI primitives (Shadcn base)
npm install @radix-ui/react-slot
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install @radix-ui/react-progress
npm install @radix-ui/react-separator
npm install @radix-ui/react-label

# Dev dependencies
npm install -D typescript @types/react @types/react-dom
npm install -D @types/better-sqlite3
npm install -D tailwindcss postcss autoprefixer
npm install -D drizzle-kit
npm install -D vite @vitejs/plugin-react
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### package.json Reference

```json
{
  "name": "branding-os",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "db:generate": "drizzle-kit generate:sqlite",
    "db:migrate": "drizzle-kit push:sqlite",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google/generative-ai": "^0.1.0",
    "zustand": "^4.4.0",
    "drizzle-orm": "^0.29.0",
    "better-sqlite3": "^9.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-label": "^2.0.2",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.300.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/better-sqlite3": "^7.6.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "drizzle-kit": "^0.20.0",
    "eslint": "^8.0.0",
    "postcss": "^8.4.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 3. Environment Variables

### Create .env.example

```env
# Gemini API (required)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Imagen API (placeholder - not yet available)
VITE_IMAGEN_API_KEY=your_imagen_api_key_here

# Database
DATABASE_URL=./db/branding.db

# Optional: Development settings
VITE_DEV_MODE=true
```

### Create .env.local

```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

**IMPORTANT:** Add `.env.local` to `.gitignore`

```gitignore
# .gitignore
.env.local
node_modules/
dist/
db/*.db
db/*.db-journal
```

---

## 4. Setup Commands

### Step-by-Step Installation

```bash
# 1. Create project directory
mkdir -p D:\genesis-meta-system\branding-os
cd D:\genesis-meta-system\branding-os

# 2. Initialize Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# 3. Install dependencies (see section 2)
npm install

# 4. Setup Tailwind CSS
npx tailwindcss init -p

# 5. Create folder structure
mkdir -p src/{agents,components/{ui,wizard,brand-config,asset},lib,stores,hooks,types,pages}
mkdir -p db
mkdir -p docs

# 6. Setup environment variables
cp .env.example .env.local

# 7. Initialize database
npm run db:generate
npm run db:migrate

# 8. Start development server
npm run dev
```

---

## 5. Development Workflow

### Daily Development

```bash
# Start dev server (hot reload)
npm run dev

# Open in browser: http://localhost:5173
```

### Build & Preview

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Database Management

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (DB GUI)
npm run db:studio
```

### Code Quality

```bash
# Lint TypeScript
npm run lint

# Type checking
tsc --noEmit
```

### Git Workflow

```bash
# Commit changes
git add .
git commit -m "feat: implement wizard step 1"

# Push to development branch
git push origin main
```

---

## 6. Code Conventions

### File Naming

- **Components:** `kebab-case.tsx` (e.g., `wizard-container.tsx`)
- **Types:** `kebab-case.ts` (e.g., `brand.ts`)
- **Utilities:** `kebab-case.ts` (e.g., `gemini.ts`)
- **Stores:** `kebab-case-store.ts` (e.g., `wizard-store.ts`)

### Component Naming

```typescript
// PascalCase for components
export function WizardContainer() { }
export const BrandCard = () => { }
```

### Type Naming

```typescript
// PascalCase with descriptive prefixes
export type TBrandIdentity = { }
export interface IAgentResponse { }
export enum EAgentType { }
```

### Constants

```typescript
// UPPER_SNAKE_CASE
export const AGENT_TIMEOUT = 30000;
export const MAX_RETRIES = 3;
```

### Function Naming

```typescript
// camelCase, verb-first
function generateBrandStrategy() { }
async function fetchBrandData() { }
const handleSubmit = () => { }
```

### Import Order

```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. External libraries
import { z } from 'zod';

// 3. Internal - components
import { Button } from '@/components/ui/button';

// 4. Internal - lib
import { geminiClient } from '@/lib/gemini';

// 5. Internal - types
import type { TBrandIdentity } from '@/types/brand';

// 6. Styles
import './styles.css';
```

---

## 7. First Files to Create (Priority Order)

### Phase 1: Configuration & Setup (Do First)

1. **tailwind.config.js** - Tailwind configuration
2. **tsconfig.json** - TypeScript configuration
3. **vite.config.ts** - Vite configuration
4. **src/lib/utils.ts** - Utility functions (cn helper)
5. **.env.local** - Environment variables

### Phase 2: Core Types & Schema

6. **src/types/brand.ts** - Brand identity types
7. **src/types/agent.ts** - Agent interfaces
8. **src/types/wizard.ts** - Wizard step types
9. **src/lib/schema.ts** - Database schema (Drizzle)
10. **src/lib/validators.ts** - Zod schemas

### Phase 3: API Clients

11. **src/lib/gemini.ts** - Gemini API client
12. **src/lib/db.ts** - Database client
13. **src/lib/imagen.ts** - Imagen API placeholder

### Phase 4: State Management

14. **src/stores/wizard-store.ts** - Wizard state
15. **src/stores/brand-store.ts** - Brand identity state
16. **src/stores/agent-store.ts** - Agent execution state

### Phase 5: Base Agent Architecture

17. **src/agents/base-agent.ts** - Abstract base agent
18. **src/agents/orchestrator.ts** - Agent coordination
19. **src/agents/analyzer.ts** - First concrete agent

### Phase 6: UI Components (Shadcn)

20. **src/components/ui/button.tsx**
21. **src/components/ui/card.tsx**
22. **src/components/ui/input.tsx**
23. **src/components/ui/progress.tsx**

### Phase 7: Wizard Flow

24. **src/components/wizard/wizard-container.tsx**
25. **src/components/wizard/step-1-input.tsx**
26. **src/pages/wizard.tsx**

### Phase 8: Main App

27. **src/App.tsx** - App shell with routing
28. **src/main.tsx** - Entry point
29. **src/index.css** - Global styles

---

## 8. Quick Configuration Files

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
    },
  },
  plugins: [],
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 9. Development Checklist

### Before You Start Coding

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database initialized (`npm run db:migrate`)
- [ ] Tailwind CSS configured
- [ ] Dev server running (`npm run dev`)

### Before Each Commit

- [ ] Code linted (`npm run lint`)
- [ ] Types checked (`tsc --noEmit`)
- [ ] Changes tested in browser
- [ ] Commit message follows convention (`feat:`, `fix:`, etc.)

### Before Pull Request

- [ ] Production build succeeds (`npm run build`)
- [ ] All features work in production preview
- [ ] No console errors
- [ ] README updated if needed

---

## 10. Troubleshooting

### Common Issues

**Issue:** `Cannot find module '@/...'`
**Fix:** Check `tsconfig.json` has correct path aliases

**Issue:** Tailwind styles not applying
**Fix:** Ensure `index.css` imports Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Issue:** Database errors
**Fix:** Delete `db/*.db` and run `npm run db:migrate` again

**Issue:** Gemini API errors
**Fix:** Verify `.env.local` has correct API key

---

## Next Steps

1. Follow **Phase 1-8** file creation order
2. Start with wizard UI (Step 1 - Brand Input)
3. Implement Analyzer agent
4. Test end-to-end flow with one agent
5. Expand to full agent pipeline

**Ready to build!** Start with Phase 1 configuration files.
