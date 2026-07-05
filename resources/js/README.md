# Frontend Architecture

The frontend follows a lightweight Feature-Sliced Design layout with DDD accents.

## Layers

- `app.tsx` - application bootstrap and Inertia page resolution.
- `pages/*/ui` - route-level screens. Pages compose widgets, features, entities, and shared UI.
- `entities/*` - domain objects and their UI/model code. Example: `entities/vehicle`.
- `entities/*/api` - repositories for entity-specific backend queries.
- `features/*/model` - user-scenario state and orchestration. Example: catalog search loads vehicles, makes, and models; catalog filter owns filter state and pure filtering rules.
- `features/*/ui` - reusable scenario UI. Example: catalog filter sidebar.
- `shared/api` - low-level API clients with no domain knowledge.
- `shared/ui` - reusable UI atoms and low-level controls with no business knowledge.
- `shared/layout` - reusable application shell pieces such as header and layout.

## Rules

- Pages may import from `entities` and `shared`.
- Entities may import from `shared`, but should not import from `pages`.
- Shared code must stay domain-agnostic.
- Domain types live near their entity in `entities/<name>/model`.
- API calls should go through `shared/api` plus an entity repository, not directly from page components.
- Add `features/*` when a user action becomes reusable across pages.
- Add `widgets/*` when a composed section is reused across pages.

Use the `@/` alias for imports from `resources/js`.
