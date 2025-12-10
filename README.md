# BRANDING OS

> Marketing brain that knows your brand, creates agency-quality assets in minutes, and learns from what works.

## Vision

Transform brand guidelines into an AI-powered production system that generates on-brand marketing assets in under 5 minutes, eliminating bottlenecks and ensuring visual consistency at scale.

## Problem We Solve

| Problem | Impact | Solution |
|---------|--------|----------|
| Slow creation | 2-3 hours per carousel | < 5 minutes with AI |
| Brand inconsistency | 40% violation rate | 95%+ compliance via Quality Gate |
| Designer bottleneck | 3-5 day turnaround | Anyone can create |
| Assets get lost | Zero tracking | Full metadata + library |
| No learning | Starts from zero | Learns from winners |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BRANDING OS                              │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Interface                                          │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Wizard  │  │ Autopilot│  │ Advanced │                    │
│  └─────────┘  └──────────┘  └──────────┘                    │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Multi-Agent Processing                             │
│  ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐           │
│  │Analyzer│→│Strategist│→│Copywriter│→│Visual  │           │
│  └────────┘ └──────────┘ └──────────┘ │Director│           │
│                                        └────────┘           │
│  ┌────────┐ ┌────────────┐                                  │
│  │Composer│→│Quality Gate│→ Human Approval → Export         │
│  └────────┘ └────────────┘                                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Content Management                                 │
│  Asset Library │ Calendar │ Ideas Bank │ Narrative Bank     │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Brand Knowledge                                    │
│  Brand Config │ Templates │ Patterns │ Anti-Patterns        │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Business Context                                   │
│  Products │ Campaigns │ Funnels │ Consciousness Levels      │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| AI (Copy) | Gemini 2.5 Pro |
| AI (Visual) | Imagen 3 |
| Database | SQLite (MVP) → PostgreSQL |
| Deploy | Vercel |

## Documentation

| Document | Description | Path |
|----------|-------------|------|
| **PRD** | Complete product requirements | [docs/prd/BRANDING-OS-PRD.md](docs/prd/BRANDING-OS-PRD.md) |
| **Architecture** | System design & technical specs | [docs/architecture/SYSTEM-ARCHITECTURE.md](docs/architecture/SYSTEM-ARCHITECTURE.md) |
| **UX Spec** | Wireframes, flows, components | [docs/prd/UX-SPECIFICATION.md](docs/prd/UX-SPECIFICATION.md) |
| **Stories** | Epics & user stories for MVP | [docs/stories/MVP-EPICS-STORIES.md](docs/stories/MVP-EPICS-STORIES.md) |
| **Test Plan** | QA strategy & test cases | [docs/testing/TEST-PLAN.md](docs/testing/TEST-PLAN.md) |
| **Setup Guide** | Project bootstrapping | [docs/PROJECT-SETUP-GUIDE.md](docs/PROJECT-SETUP-GUIDE.md) |

## Source Materials

| Document | Description |
|----------|-------------|
| [BRANDING OS — BRIEF DO PROJETO.md](BRANDING%20OS%20—%20BRIEF%20DO%20PROJETO.md) | Original project brief |
| [branding-os-documento-completo.md](branding-os-documento-completo.md) | Complete vision document |
| [branding-os-ux-vision.md](branding-os-ux-vision.md) | UX vision from JP |
| [Transcript - Call JP.md](Transcript%20-%20Call%20JP.md) | 59-minute planning call transcript |

## MVP Scope (2 Weeks)

### Must Have
- [ ] 5-step creation wizard
- [ ] 3 asset types: Carousel, Slide, Ad
- [ ] 6 AI agents pipeline
- [ ] Brand configuration (colors, fonts, voice)
- [ ] Quality Gate validation
- [ ] PNG/PDF export
- [ ] Human-in-the-loop approval

### Success Criteria
- **Completion time:** < 5 minutes
- **Brand compliance:** 95%+
- **First-pass approval:** 70%+
- **Weekly output:** 10+ assets

## Quick Start

```bash
# Navigate to project
cd D:\genesis-meta-system\branding-os

# Create Vite React project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add your GEMINI_API_KEY and IMAGEN_API_KEY

# Start development
npm run dev
```

See [PROJECT-SETUP-GUIDE.md](docs/PROJECT-SETUP-GUIDE.md) for complete setup instructions.

## Sprint Plan

### Sprint 1 (Week 1) - Foundation
- Day 1-2: Infrastructure + Database
- Day 3-4: Brand Configuration
- Day 5-7: Agents (Analyzer, Strategist, Copywriter)

### Sprint 2 (Week 2) - Generation
- Day 8-9: Agents (Visual Director, Composer, Quality Gate)
- Day 10-11: Wizard UI + Integration
- Day 12-13: Export + Testing
- Day 14: Polish + Deploy

## Team

| Role | Person | Responsibility |
|------|--------|----------------|
| Product Owner | Lozano | Vision, requirements, AI strategy |
| Brand Lead | JP | Brand config, quality standards |
| Development | TBD | Implementation |

## License

Proprietary - Academia Lendária

---

**Generated by AIOS Orchestrator** | Full Power Mode | December 2024
