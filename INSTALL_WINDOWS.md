# Install the combined frontend on Windows

This is a cumulative replacement for Layer 1. Do not create another CRA app.
Your Spring Boot project is not modified by this archive.

1. Stop the running frontend with Ctrl+C in its terminal.
2. Make a backup of H:\HMS\piyum-villa-web (at least src, public, package.json,
   package-lock.json, tsconfig.json, tailwind.config.js and your environment files).
3. Extract this ZIP to a temporary folder. Inside it is piyum-villa-web.
4. In your existing H:\HMS\piyum-villa-web, replace the complete src and public
   folders with the folders from the archive. Remove the old folders first so
   obsolete files such as App.test.tsx do not remain. Keep your backup.
5. Copy package.json, package-lock.json, tsconfig.json, tailwind.config.js,
   .env.example and the Markdown instructions from the archive into the project.
   Use the included dependency versions together. node_modules is not included.
6. Create or edit .env.local at the project root:

   REACT_APP_DATA_MODE=mock
   REACT_APP_API_BASE_URL=http://localhost:8081/piyumvilla/api/v1

   These are public frontend settings. Never put JWT_SECRET or database passwords
   in any REACT_APP variable. Leave DATA_MODE as mock for the complete demo flows.
7. Open Command Prompt and run, one line at a time:

   cd /d H:\HMS\piyum-villa-web
   npm ci
   npm start

8. Open http://localhost:3000. If this port is busy, stop the older frontend
   process rather than unintentionally running two copies.

No backend is needed in mock mode. No mock test suite needs to be run.
For a production bundle, run npm run build. The output is build/.
For static hosting, configure all frontend routes to fall back to index.html.
Restart npm start whenever environment values change.

## Sign in

All built-in demonstration accounts use: DemoStay123!

- guest@demo.piyumvilla.test — customer bookings and profile
- owner@demo.piyumvilla.test — administrator workspace
- manager@demo.piyumvilla.test — manager workspace
- reception@demo.piyumvilla.test — reception workspace
- housekeeping@demo.piyumvilla.test — room conditions
- accounts@demo.piyumvilla.test — cash ledger and booking balances

Use only fictional personal details in demonstration mode. Demo records live in
this browser's local storage, not MySQL. Reloading signs you out intentionally;
the saved demo records remain. Sessions also expire after 15 minutes.

To reset demo records, open the browser console on localhost:3000 and run:

localStorage.removeItem('piyum-villa-demo-v2'); location.reload();

This deletes only this application's demo dataset. It does not affect MySQL.

## Real authentication only

Set REACT_APP_DATA_MODE=api and restart to use the configured backend signin,
signup and /auth/me adapter. Other domain operations deliberately display a
missing-integration message; they do not silently use mock data. Read
BACKEND_INTEGRATION.md before attempting real bookings.

## Troubleshooting

- Blank page / compilation error: retain the first full error and filename;
  verify that src was replaced entirely and npm ci completed successfully.
- Port 3000 already occupied: stop the previous npm start terminal.
- 401: sign in again; sessions last 15 minutes.
- API network error: confirm Spring Boot is running on port 8081 with context
  path /piyumvilla and CORS allows http://localhost:3000.
- Newly created anonymous booking cannot be reopened after a full reload:
  anonymous demo access is intentionally limited to the current tab session.
  Production requires a server-issued secure access link.
- Do not run npm audit fix --force as an installation step; it can change CRA's
  dependency graph. CRA remains the requested project structure.
