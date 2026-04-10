# Design Brief — CyberPortal

**Purpose**: Dark cyber glassmorphic incident reporting platform for SOC (Security Operations Center) analysts managing critical security events with real-time alerting and workflow tracking.

| Attribute | Direction |
| --- | --- |
| **Tone** | Precision-focused, trustworthy tech; premium without decoration. SOC analysts need clarity under pressure — every UI choice reduces cognitive load. |
| **Differentiation** | Glassmorphic card design with frosted blue tints, precision dark backgrounds, and accent-driven hierarchy. Neon-blue primary actions, critical red alerts with pulse animation. Avoids generic dark-mode templates. |

## Palette (OKLCH)

| Token | Light | Dark |
| --- | --- | --- |
| background | 0.99 0 0 | 0.08 0.01 240 |
| foreground | 0.15 0 0 | 0.94 0.02 210 |
| primary (blue accent) | 0.42 0.16 270 | 0.65 0.25 260 |
| accent (neon blue) | 0.42 0.16 270 | 0.65 0.25 260 |
| destructive (critical red) | 0.55 0.22 25 | 0.62 0.25 25 |
| border (subtle blue-tint) | 0.88 0.04 260 | 0.18 0.05 250 |
| card (glassmorphic) | 0.96 0.01 240 | 0.12 0.02 240 |

## Typography

- **Display**: Plus Jakarta Sans (bundled) — bold headers, navigation, status badges
- **Body**: Inter (system fallback) — incident details, form labels, alerts
- **Mono**: Inter — incident IDs, IP addresses, code snippets
- **Scale**: 32px (h1) → 24px (h2) → 16px (h3) → 14px (body) → 12px (caption)

## Structural Zones

| Zone | Treatment | Purpose |
| --- | --- | --- |
| Header | card-bg with border-b, subtle shadow | SOC status, analyst name, alert count |
| Sidebar (nav) | darker card-bg, glassmorphic on hover | Operations/Intelligence sections, NEW badge on Report |
| Main Content | bg-background, card-grid | Form tabs, incident tables, charts |
| Form Inputs | glassmorphic-card with blue-tint border | Frosted appearance, clear focus states |
| Alerts/Badges | destructive color, pulse animation | Critical incidents draw attention |

## Shape & Spacing

- **Radius**: 0.5rem (8px) — modern but not rounded; balanced |
| **Density**: Compact form fields (12px gaps), relaxed card spacing (24px) |
| **Shadows**: Minimal; rely on glassmorphic blur + borders, not depth |

## Component Patterns

- **Buttons**: Primary (blue), Secondary (muted), Danger (red) — all use accent colors, no outlines |
- **Form Fields**: glassmorphic-card, placeholder muted, focus border-primary glow |
| **Tabs**: Underline active, muted inactive; no background fill |
| **Badges**: NEW (accent), Critical (red pulse), Normal (muted) |
| **Tables**: Striped rows (bg-muted/5 alternate), hover highlight |

## Motion

- **Transitions**: All interactive (0.3s smooth cubic-bezier) — buttons, hovers, focus |
- **Alerts**: Pulsing critical badges (2s loop, red glow fade) |
- **Loading**: Subtle spinner (blue accent, 1s rotation) |

## Dark Mode Only

All tokens tuned for dark mode (default). Light mode palette provided for fallback but not primary design target.

## Signature Detail

**Glassmorphic cards with frosted blue backdrop** — the core visual language. Combines precision dark backgrounds (#0a0e27, #1a1f3a) with semi-transparent panels (40% opacity) + backdrop-blur-lg + subtle blue-tinted borders. No harsh edges; every surface breathes. Combined with precise OKLCH accent colors (neon blue #6b8cff, vibrant green #2de3a5), creates premium SOC tooling feel without decoration.

## Anti-Pattern Avoiding

- No generic shadcn dark theme (custom OKLCH tokens throughout) |
- No purple gradients or rainbow palettes (blue + red + green only, by purpose) |
- No full-page gradient backgrounds (clean layers via opacity + blur) |
- No scattered micro-animations (choreographed pulse + smooth transitions only) |
| No default border radius everywhere (intentional radius hierarchy) |
