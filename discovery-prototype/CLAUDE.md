# discovery-prototype

Next.js prototype with the Databricks shell (Sidebar, TopNav, layout) and the Dubois design system pre-configured.

## Design System — Dubois First

**Always default to the Databricks design system (Dubois)** before hardcoding or creating custom implementations.

### Priority Order
1. **Dubois token** — `theme.colors.*`, `theme.spacing.*`, `theme.borders.*`, `theme.typography.*`
2. **Dubois component** — `Button`, `Tag`, `Tabs`, `Alert`, `Popover`, etc. from `@databricks/design-system`
3. **Dubois icon** — Import from `@databricks/design-system` (e.g., `SearchIcon`, `NotebookIcon`)
4. **Custom implementation** — Only when Dubois doesn't provide what's needed, and only after confirming

### Colors
Use `theme.colors.*` tokens. Never hardcode hex values when a token exists.
Do NOT use fallback operators (`||`, `??`) — design system theme values are guaranteed to exist.

### Spacing
Use `theme.spacing.*` tokens. Never hardcode `8px`, `16px`, etc. when tokens exist.

### Components
Always search `@databricks/design-system` first before building custom. Never silently create custom implementations of buttons, tabs, inputs, modals, or other standard UI elements.

### Icons
Default to Dubois icons. Naming pattern: `[Name]Icon` (e.g., `SearchIcon`, `PlayIcon`).
Never use emoji characters, inline SVGs, or third-party icon libraries when a Dubois icon exists.

### Typography
Use `theme.typography.*` tokens for font sizes, weights, and line heights.
- `fontSizeBase` (13px), `fontSizeSm` (12px), `fontSizeLg` (18px)
- `typographyRegularFontWeight` (400), `typographyBoldFontWeight` (600)

## Running

```bash
npm run dev    # local dev server
npm run build  # static export to out/
npm start      # serve the built output via express server.js
```
