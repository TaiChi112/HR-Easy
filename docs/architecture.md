# Architecture Overview

This document defines the request flow and responsibility boundaries for the Next.js + Elysia hybrid application.

## Boundaries

- Presentation Boundary: Next.js Client and Server Components in `src/app/`
- API Client Boundary: Eden client wrapper in `src/lib/api-client.ts`
- Transport Boundary: Elysia route bridge in `src/app/api/[...elysia]/route.ts`
- Domain Boundary: HR module in `src/modules/hr/`

## Request Flow (Sequence + Boundaries)

```mermaid
flowchart LR
  subgraph P[Presentation Boundary\nNext.js App Router]
    direction TB
    C[Client Components]
    S[Server Components]
  end

  subgraph E[Eden Client Boundary]
    direction TB
    EC["src/lib/api-client.ts\n@elysiajs/eden"]
  end

  subgraph T[Transport Boundary]
    direction TB
    RH["src/app/api/[...elysia]/route.ts\nElysia API Route Handler"]
  end

  subgraph D[HR Domain Boundary]
    direction TB
    HC[src/modules/hr/hr.controller.ts]
    HS[src/modules/hr/hr.service.ts]
  end

  C -->|typed API call| EC
  S -->|typed API call| EC
  EC -->|HTTP request with inferred types| RH
  RH -->|delegate use case| HC
  HC -->|execute business logic| HS
  HS -->|domain result| HC
  HC -->|response DTO| RH
  RH -->|typed response| EC
  EC -->|fully inferred data| C
  EC -->|fully inferred data| S
```

## Responsibility Rules

- Next.js components orchestrate UI and state only; no business rules.
- Eden client centralizes typed API access; no domain logic.
- Route handler validates and delegates; no core business rules.
- HR service contains business rules and data shaping for HR use cases.
- Type contracts flow from Elysia AppType to Eden for end-to-end type safety.
