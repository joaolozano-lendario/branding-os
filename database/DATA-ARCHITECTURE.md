# Branding OS - Arquitetura de Dados

> **Documento para stakeholders, PMs, designers e outros times.**
> Explica como os dados do Branding OS são organizados sem jargão técnico.

---

## O Que Este Documento Cobre

1. [Visão Geral](#visão-geral) - O que o sistema armazena
2. [Entidades Principais](#entidades-principais) - Os "objetos" do sistema
3. [Como Tudo Se Conecta](#como-tudo-se-conecta) - Relacionamentos
4. [Fluxo de Dados](#fluxo-de-dados) - Como a informação flui
5. [Segurança e Acesso](#segurança-e-acesso) - Quem vê o quê
6. [Armazenamento de Arquivos](#armazenamento-de-arquivos) - Onde ficam as imagens

---

## Visão Geral

O Branding OS é um **sistema de geração de assets de marketing** que precisa armazenar:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   PESSOAS          MARCAS           CONTEÚDO         GERAÇÃO       │
│   ────────         ──────           ────────         ───────       │
│   Usuários         Identidade       Campanhas        Assets        │
│   Permissões       Produtos         Templates        Jobs          │
│   Perfis           Configuração     Regras           Histórico     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Números Esperados (MVP → Escala)

| Entidade | MVP | 1 Ano | Escala |
|----------|-----|-------|--------|
| Usuários | 10 | 500 | 10.000+ |
| Marcas | 5 | 200 | 5.000+ |
| Assets | 100 | 10.000 | 500.000+ |
| Templates | 20 | 200 | 1.000+ |

---

## Entidades Principais

### 1. Usuários (Profiles)

**O que é:** Pessoas que usam o sistema.

**O que armazena:**
- Nome e email
- Foto de perfil
- Empresa e cargo
- Preferências (idioma, fuso horário)
- Status de onboarding

**Exemplo:**
```
João Silva
joao@empresa.com
Diretor de Marketing
São Paulo (GMT-3)
Onboarding: Completo
```

---

### 2. Marcas (Brands)

**O que é:** A identidade completa de uma marca/empresa.

**O que armazena:**

```
┌─────────────────────────────────────────────────────────────────┐
│                         MARCA                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  IDENTIDADE              VOZ                    VISUAL           │
│  ───────────             ───                    ──────           │
│  • Missão                • Tom de voz           • Cores          │
│  • Visão                 • Idioma               • Tipografia     │
│  • Valores               • Estilo               • Logo           │
│  • Personalidade         • O que fazer          • Estilo visual  │
│                          • O que NÃO fazer                       │
│                                                                  │
│  AUDIÊNCIA                                                       │
│  ─────────                                                       │
│  • Segmentos de público                                          │
│  • Dores do cliente                                              │
│  • Desejos do cliente                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Exemplo - Academia Lendária:**
```
Identidade:
  Missão: "Transformar pessoas comuns em profissionais lendários"
  Valores: ["Excelência", "Autenticidade", "Transformação"]
  Personalidade: ["Rebelde", "Mago", "Sábio"]

Voz:
  Tom: ["Direto", "Inspirador", "Provocativo"]
  Fazer: ["Usar linguagem ativa", "Começar com benefícios"]
  Não fazer: ["Usar jargões", "Ser genérico"]

Visual:
  Cor principal: Dourado (#C9B298) - máximo 8% da área
  Tipografia: Inter (títulos) + Source Serif (corpo)
  Estilo: "Premium, sofisticado, minimalista"
```

---

### 3. Produtos (Products)

**O que é:** Produtos ou serviços que a marca oferece.

**O que armazena:**
- Nome e descrição
- Características e benefícios
- Preço
- Imagem

**Por que existe:** Permite gerar assets específicos para cada produto.

**Exemplo:**
```
Produto: "Dominando o Obsidian"
Descrição: "Curso completo de segundo cérebro"
Benefícios: ["Organização mental", "Produtividade 10x"]
Preço: R$ 497,00
```

---

### 4. Campanhas (Campaigns)

**O que é:** Agrupamento de assets para uma ação de marketing específica.

**O que armazena:**
- Nome e objetivo
- Público-alvo
- Mensagens-chave
- Período (início/fim)
- Status (rascunho, ativa, pausada, finalizada)
- Orçamento

**Exemplo:**
```
Campanha: "Black Lendária 2024"
Objetivo: "Vender 500 vagas do curso"
Período: 20/11 a 30/11
Mensagens: ["Última chance do ano", "Bônus exclusivos"]
Status: Ativa
```

---

### 5. Templates

**O que é:** Modelos reutilizáveis para gerar assets.

**Três tipos:**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    COPY         │  │    LAYOUT       │  │    COMPLETO     │
│    ────         │  │    ──────       │  │    ────────     │
│                 │  │                 │  │                 │
│  Estrutura de   │  │  Posição dos    │  │  Copy + Layout  │
│  texto:         │  │  elementos:     │  │  combinados     │
│                 │  │                 │  │                 │
│  • Headline     │  │  • Imagem       │  │  Pronto para    │
│  • Corpo        │  │  • Texto        │  │  usar com       │
│  • CTA          │  │  • Logo         │  │  variáveis      │
│  • Hashtags     │  │  • Formas       │  │                 │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Exemplo de Template:**
```
Nome: "Post de Lançamento Instagram"
Tipo: Completo
Plataforma: Instagram
Dimensões: 1080x1080px

Estrutura:
  Headline: "{{benefício}} em {{prazo}}"
  Corpo: "{{descrição do produto}}"
  CTA: "{{ação}} agora"

Layout:
  - Imagem de fundo (gerada por IA)
  - Texto centralizado
  - Logo no canto inferior direito
```

---

### 6. Assets

**O que é:** O produto final - as peças de marketing geradas.

**O que armazena:**

```
┌─────────────────────────────────────────────────────────────────┐
│                          ASSET                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ARQUIVO                 CONTEÚDO               QUALIDADE        │
│  ───────                 ────────               ─────────        │
│  • URL da imagem         • Headline             • Score (0-100)  │
│  • Thumbnail             • Texto                • Validações     │
│  • Formato (PNG/JPG)     • CTA                  • Sugestões      │
│  • Dimensões             • Hashtags                              │
│                                                                  │
│  CONTEXTO                                                        │
│  ────────                                                        │
│  • Pedido original do usuário                                    │
│  • Outputs de cada agente IA                                     │
│  • Template usado                                                │
│  • Campanha associada                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Exemplo:**
```
Asset: Post Instagram - Black Friday
Tipo: Post
Plataforma: Instagram
Dimensões: 1080x1080

Conteúdo:
  Headline: "Sua última chance em 2024"
  Corpo: "Transforme sua carreira com o método..."
  CTA: "Garanta sua vaga"
  Hashtags: #blackfriday #cursoonline

Qualidade: 92/100
Status: Aprovado
```

---

### 7. Jobs de Geração

**O que é:** O "pedido" de um asset sendo processado.

**Por que existe:** A geração de assets leva tempo (15-30 segundos). O job permite:
- Mostrar progresso em tempo real
- Continuar trabalhando enquanto processa
- Rastrear erros se algo der errado

**Ciclo de vida:**

```
  PENDENTE → PROCESSANDO → COMPLETO
      │           │            │
      │           │            └── Asset criado com sucesso
      │           │
      │           └── Agentes IA trabalhando:
      │               1. Analisador (10%)
      │               2. Estrategista (25%)
      │               3. Copywriter (45%)
      │               4. Designer Visual (65%)
      │               5. Compositor (85%)
      │               6. Validador (100%)
      │
      └── Na fila, aguardando

  Se der erro: PROCESSANDO → FALHOU (com mensagem de erro)
```

---

### 8. Regras de Validação

**O que é:** Critérios que todo asset deve passar antes de ser aprovado.

**Categorias:**

| Categoria | Exemplos |
|-----------|----------|
| **Marca** | Cores corretas, tom de voz adequado |
| **Plataforma** | Dimensões certas para Instagram/LinkedIn |
| **Acessibilidade** | Contraste legível, texto grande o suficiente |
| **Legal** | Disclaimers obrigatórios, copyright |

**Exemplo de regra:**
```
Regra: "Cor primária máximo 8%"
Categoria: Marca
Severidade: Erro (bloqueia aprovação)
Configuração: Cor #C9B298 não pode ocupar mais de 8% da área
```

---

## Como Tudo Se Conecta

### Diagrama de Relacionamentos

```
                              ┌─────────────┐
                              │   USUÁRIO   │
                              └──────┬──────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                     É DONO DE            É MEMBRO DE
                          │                     │
                          ▼                     ▼
                    ┌───────────┐         ┌───────────┐
                    │   MARCA   │◄────────│  MEMBROS  │
                    └─────┬─────┘         └───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
  ┌───────────┐     ┌───────────┐     ┌───────────┐
  │ PRODUTOS  │     │ CAMPANHAS │     │ TEMPLATES │
  └───────────┘     └─────┬─────┘     └─────┬─────┘
                          │                 │
                          └────────┬────────┘
                                   │
                                   ▼
                             ┌───────────┐
                             │  ASSETS   │
                             └─────┬─────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │ VERSÕES  │  │   JOBS   │  │ EXPORTS  │
              └──────────┘  └──────────┘  └──────────┘
```

### Em Palavras Simples

1. **Usuário** cria e gerencia **Marcas**
2. **Marca** contém toda a identidade: **Produtos**, **Campanhas**, **Templates**
3. **Campanha** agrupa **Assets** de uma ação específica
4. **Template** serve de base para gerar **Assets**
5. **Asset** pode ter várias **Versões** (histórico de edições)
6. **Job** registra o processo de criação de cada **Asset**

---

## Fluxo de Dados

### Fluxo de Geração de Asset

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FLUXO DE GERAÇÃO                                │
└─────────────────────────────────────────────────────────────────────┘

    USUÁRIO                    SISTEMA                      RESULTADO
    ───────                    ───────                      ─────────

 ┌───────────┐
 │ "Crie um  │
 │ post para │───────────────┐
 │ Instagram"│               │
 └───────────┘               ▼
                      ┌─────────────┐
                      │ Criar JOB   │
                      │ (pendente)  │
                      └──────┬──────┘
                             │
                             ▼
                      ┌─────────────┐
                      │ Carregar    │
                      │ dados da    │◄──── Marca, Produtos,
                      │ MARCA       │      Campanhas, Templates
                      └──────┬──────┘
                             │
                             ▼
                      ┌─────────────┐
                      │ Pipeline    │
                      │ de Agentes  │───── 6 agentes IA processam
                      │ IA          │      em sequência
                      └──────┬──────┘
                             │
                             ▼
                      ┌─────────────┐
                      │ Validar     │───── Verificar regras
                      │ Asset       │      da marca
                      └──────┬──────┘
                             │
                             ▼                        ┌───────────┐
                      ┌─────────────┐                 │           │
                      │ Salvar      │────────────────►│  ASSET    │
                      │ Asset       │                 │  CRIADO   │
                      └─────────────┘                 │           │
                                                      └───────────┘
```

### Fluxo de Acesso (Multi-tenant)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONTROLE DE ACESSO                              │
└─────────────────────────────────────────────────────────────────────┘

     MARCA: Academia Lendária
     ─────────────────────────

     ┌─────────────────────────────────────────────────────────────┐
     │                                                             │
     │   DONO (Owner)          EDITOR              VISUALIZADOR    │
     │   ────────────          ──────              ────────────    │
     │                                                             │
     │   João                  Maria               Pedro           │
     │                                                             │
     │   ✓ Ver tudo            ✓ Ver tudo          ✓ Ver tudo     │
     │   ✓ Editar tudo         ✓ Editar assets     ✗ Editar       │
     │   ✓ Deletar             ✓ Criar assets      ✗ Criar        │
     │   ✓ Convidar membros    ✗ Deletar           ✗ Deletar      │
     │   ✓ Configurar marca    ✗ Convidar          ✗ Convidar     │
     │                                                             │
     └─────────────────────────────────────────────────────────────┘
```

---

## Segurança e Acesso

### Princípios

1. **Isolamento por Marca**
   - Usuários só veem dados das marcas que têm acesso
   - Impossível acessar dados de outras marcas

2. **Permissões por Papel**
   - Owner: Controle total
   - Editor: Criar e editar conteúdo
   - Viewer: Apenas visualizar

3. **Tudo é Auditado**
   - Quem fez o quê e quando
   - Histórico de mudanças

### O Que Cada Papel Pode Fazer

| Ação | Owner | Editor | Viewer |
|------|:-----:|:------:|:------:|
| Ver assets | ✓ | ✓ | ✓ |
| Ver configuração da marca | ✓ | ✓ | ✓ |
| Criar assets | ✓ | ✓ | ✗ |
| Editar assets | ✓ | ✓ | ✗ |
| Deletar assets | ✓ | ✗ | ✗ |
| Criar campanhas | ✓ | ✓ | ✗ |
| Editar configuração da marca | ✓ | ✗ | ✗ |
| Convidar membros | ✓ | ✗ | ✗ |
| Deletar marca | ✓ | ✗ | ✗ |
| Ver métricas de uso | ✓ | ✗ | ✗ |
| Gerenciar API keys | ✓ | ✗ | ✗ |

---

## Armazenamento de Arquivos

### Três "Pastas" Principais

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ARMAZENAMENTO DE ARQUIVOS                       │
└─────────────────────────────────────────────────────────────────────┘

  ┌─────────────────────┐
  │    BRAND-ASSETS     │  ← Arquivos da marca
  │    ─────────────    │
  │                     │
  │  • Logos            │    Privado
  │  • Imagens produto  │    Só membros da marca acessam
  │  • Assets manuais   │
  │                     │
  └─────────────────────┘

  ┌─────────────────────┐
  │  GENERATED-ASSETS   │  ← Assets gerados pela IA
  │  ────────────────   │
  │                     │
  │  • Posts            │    Privado
  │  • Stories          │    Só membros da marca acessam
  │  • Banners          │
  │  • Carrosséis       │
  │                     │
  └─────────────────────┘

  ┌─────────────────────┐
  │     THUMBNAILS      │  ← Miniaturas para preview
  │     ──────────      │
  │                     │
  │  • Previews         │    Público
  │  • Miniaturas       │    Para carregamento rápido
  │                     │
  └─────────────────────┘
```

### Organização Dentro de Cada Pasta

```
brand-assets/
└── [ID da Marca]/
    ├── logo.png
    ├── logo-dark.png
    └── products/
        ├── produto-1.png
        └── produto-2.png

generated-assets/
└── [ID da Marca]/
    └── 2024/
        └── 12/
            ├── asset-abc123.png
            └── asset-def456.png

thumbnails/
└── [ID da Marca]/
    ├── asset-abc123_thumb.png
    └── asset-def456_thumb.png
```

---

## Métricas e Analytics

### O Que É Rastreado

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MÉTRICAS POR MARCA (MENSAL)                     │
└─────────────────────────────────────────────────────────────────────┘

  Assets Gerados:     142
  ─────────────────────────────────
  Por tipo:
    • Posts:          78 (55%)
    • Stories:        34 (24%)
    • Carrosséis:     20 (14%)
    • Banners:        10 (7%)

  Por plataforma:
    • Instagram:      95 (67%)
    • LinkedIn:       32 (23%)
    • Facebook:       15 (10%)

  Qualidade média:    87/100

  Uso de IA:
    • Tokens Gemini:  1.2M
    • Imagens Imagen: 142

  Armazenamento:      2.4 GB
```

### Para Que Serve

- **Billing**: Cobrar por uso
- **Limites**: Controlar planos (free, pro, enterprise)
- **Analytics**: Entender comportamento do usuário
- **Otimização**: Identificar gargalos

---

## Glossário

| Termo | Significado |
|-------|-------------|
| **Asset** | Peça de marketing gerada (post, story, banner, etc.) |
| **Brand Config** | Toda a configuração de identidade de uma marca |
| **Campanha** | Agrupamento de assets para uma ação de marketing |
| **Job** | Pedido de geração sendo processado |
| **Owner** | Dono de uma marca (controle total) |
| **Pipeline** | Sequência de agentes IA que geram um asset |
| **RLS** | Row Level Security - controle de acesso por linha do banco |
| **Template** | Modelo reutilizável para gerar assets |
| **Thumbnail** | Miniatura de preview de um asset |

---

## Perguntas Frequentes

### "Um usuário pode ter várias marcas?"
Sim. Um usuário pode ser dono de múltiplas marcas e membro de outras.

### "Uma marca pode ter vários usuários?"
Sim. O dono pode convidar outros usuários como Editores ou Visualizadores.

### "O que acontece se eu deletar uma marca?"
Todos os dados associados são deletados: produtos, campanhas, templates, assets.

### "Posso recuperar um asset deletado?"
Se houver versões anteriores, sim. Caso contrário, não.

### "Como funciona o limite de uso?"
Cada plano tem limites mensais de assets gerados, armazenamento e tokens de IA.

### "Os dados são seguros?"
Sim. Usamos Row Level Security (RLS) do Supabase - cada usuário só vê dados das marcas que tem acesso.

---

## Contato

Para dúvidas sobre a arquitetura de dados:
- **Tech Lead**: [nome]
- **Documentação técnica**: `database/ERD.md`, `database/supabase-schema.sql`

---

*Documento criado por AIOS Orchestrator*
*Versão: 1.0.0*
*Última atualização: 2024-12-09*
