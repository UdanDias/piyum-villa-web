# Piyum Villa — Layer 1

Foundation overlay for your existing CRA TypeScript project. It is not a second CRA project.

## 1. Stop the development server
In the terminal running npm start press Ctrl+C. If asked Terminate batch job, enter Y.

## 2. Back up your starter
Keep a copy of src and public outside the project (do not put backup .tsx files under src).
This package replaces only src/App.tsx, src/index.tsx, src/index.css and public/index.html.
It adds config, context, components/theme, pages, the SVG placeholder, .env.example and tailwind.config.js.

## 3. Install Tailwind 3
Run in Command Prompt:

    cd /d H:\HMS\piyum-villa-web
    npm install --save-dev --save-exact tailwindcss@3.4.17

This updates your existing package.json/package-lock.json. Do not replace these with another project's files.
Do not install Tailwind 4, generate a PostCSS config, eject CRA or run npm audit fix --force.
The included tailwind.config.js replaces the need for npx tailwindcss init.

## 4. Copy this overlay
Extract the ZIP outside your project, e.g. Downloads.
Open its layer folder. Copy src, public, tailwind.config.js and .env.example into:

    H:\HMS\piyum-villa-web

Merge src/public folders and replace the four existing files listed above when Windows asks.
Do not create src/src or public/public. Your final files include:

    H:\HMS\piyum-villa-web\src\config\apiConfig.ts
    H:\HMS\piyum-villa-web\public\assets\placeholders\coast.svg
    H:\HMS\piyum-villa-web\tailwind.config.js

Your existing tsconfig.json and src/react-app-env.d.ts stay in place.
Remove the CRA starter src/App.test.tsx: it asserts “learn react” and is obsolete after replacing App.
You may leave src/App.css, src/logo.svg, src/reportWebVitals.ts and src/setupTests.ts unused.

## 5. Create the local environment file
If you do not already have .env.local, run:

    copy .env.example .env.local

Otherwise merge the two example values into it without deleting existing settings.
It contains:

    REACT_APP_API_BASE_URL=http://localhost:8081/piyumvilla/api/v1
    REACT_APP_DATA_MODE=mock

CRA settings are public frontend configuration. Never include JWT_SECRET, database passwords or encryption keys.
Restart npm start after changing environment variables. API mode is a future service-adapter setting;
this layer sends no requests and does not implement mock reservations yet.

## 6. Build and start

    npm run build
    npm start

Open http://localhost:3000. Expect a Piyum Villa foundation preview, illustration, and Light/Dark/System selector.
Refresh after changing the theme; it should preserve your preference where browser storage is available.

## Included files

- src/config/apiConfig.ts: typed API URL, mode, timeout; no network requests.
- src/config/hotelConfig.ts: contact, hours, currency, occupancy; inventory discrepancy explicitly tracked.
- src/config/mediaConfig.ts: local illustrative poster, null video/logo until provided.
- src/context/ThemeProvider.tsx: light/dark/system, storage fallback and OS/cross-tab updates.
- src/components/theme/ThemeSelect.tsx: accessible theme control.
- src/pages/FoundationPage.tsx: temporary preview, not the final marketing homepage.
- src/App.tsx: provider composition.
- src/index.tsx: React root and global stylesheet.
- src/index.css: Tailwind and semantic colour tokens.
- public/index.html: metadata and early theme initialization.
- public/assets/placeholders/coast.svg: original abstract placeholder, not property photography.
- tailwind.config.js: CRA-compatible Tailwind 3 configuration.
- .env.example: safe frontend defaults.

No router, authentication, database changes or backend replacements in this layer.
Next layer: TypeScript domain models, shared mock store and service interfaces.

Tailwind setup reference: https://v3.tailwindcss.com/docs/guides/create-react-app

## Build verification
This overlay compiled successfully in a separate CRA validation project using React 19.2.0,
React DOM 19.2.0, react-scripts 5.0.1, TypeScript 4.9.5 and Tailwind CSS 3.4.17.
Command: CI=true npm run build. No test suite was generated.
Your installed package versions may differ; retain your package.json and run npm run build locally.
