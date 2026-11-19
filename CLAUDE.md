# CLAUDE.md: rules for Claude working in this repo

TaskFlow is a small task tracker built with **React 18, TypeScript (strict) and Vite**, tested with **Vitest + Testing Library**, and deployed to GitHub Pages.

## Layout
- `src/tasks.ts`: pure task logic (no React, no DOM). Put business rules here.
- `src/storage.ts`: localStorage persistence. Always wrap storage access in try/catch.
- `src/App.tsx`: the UI. Keep components small; extract new components into `src/components/` if App grows.
- `src/styles.css`: all styles. Use the CSS variables in `:root`; never hard-code new colors elsewhere.
- Tests live next to code as `*.test.ts(x)`.

## Conventions
- TypeScript strict, no `any`, no unused variables (the `lint` script is `tsc --noEmit`).
- Pure functions return new arrays and objects and never mutate their inputs.
- Every new behavior needs a test: logic in `tasks.test.ts`, UI flows in `App.test.tsx`.
- Accessible UI: every input has a label or `aria-label`, buttons have readable names, toggles use `aria-pressed`.
- Do not add npm dependencies.
- If you change the shape of persisted data, keep loading older saved data working (give new fields defaults).

## Commands
- `npm test`: unit tests
- `npm run lint`: type check
- `npm run build`: production build
