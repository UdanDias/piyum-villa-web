# Piyum Villa — combined frontend

React 19 + TypeScript 4.9 + CRA react-scripts 5 + React Router 6 + Tailwind 3.
Responsive marketing website, customer booking flow and role-based staff UI.
Start with INSTALL_WINDOWS.md for exact replacement instructions.

## Included

- Coastal video hero with reduced-motion fallback, local illustrative images,
  dining / surfing / work-and-stay content, theme selection and mobile navigation.
- Date, occupancy, room-category and meal-plan search.
- Room galleries and a simplified selectable room diagram.
- Quote summary, guest checkout, account signup/signin, booking confirmation,
  customer history, cancellation and completed-stay review submission.
- Role-aware staff workspace: reservations, check-in / checkout, room conditions,
  cash receipts, customers, review moderation, hotel record settings, user roles
  and action history.
- One TypeScript service file per implemented entity/domain, shared HTTP client,
  typed domain models, auth/booking/theme contexts and route guards.

## Important scope

This is a runnable frontend implementation with browser-local demonstration
business flows. It is NOT an integrated production HMS or all 21 backend modules.
Only authentication has a real HTTP adapter. Domain API mode fails explicitly
until the adapters and server contracts described in BACKEND_INTEGRATION.md are
implemented. There is no payment gateway and no actual email delivery.

See FEATURE_COVERAGE.md for implemented and deferred items, MEDIA_SOURCES.md for
sample asset provenance, and BUILD_NOTES.md for compilation verification.

## Commands

npm ci
npm start
npm run typecheck
npm run build

## Directory responsibilities

src/config        Public app settings and asset paths
src/types         Shared domain and request/response types
src/data          Illustrative catalogue and browser-local data store
src/service       Entity/domain operations; real auth HTTP adapter
src/context       Theme, authentication and booking state
src/components    Reusable UI, search, gallery, summary and guards
src/layouts       Public website and staff workspace shells
src/pages         Marketing, booking, account and staff screens
src/utils         Date and currency formatting
public/assets     Bundled illustrative images and preview video

The mock service boundary makes backend replacement possible without rewriting
page components. Keep permissions and transactional booking logic on the server
when connecting real data; browser checks are presentation controls only.
