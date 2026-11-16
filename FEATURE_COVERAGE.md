# Coverage and assumptions

| Area | This package |
| --- | --- |
| Marketing site | Responsive homepage, accommodation, dining, policies, tourism and work/stay content |
| Media | Bundled stock photos and an animated still-image video preview; not actual hotel media |
| Authentication | Demo roles and real signin/signup HTTP adapter; token in memory, 15-minute demo sessions |
| Availability | Browser-local date overlap, category and room-condition checks |
| Room selection | 18-room schematic with selection constraints; not an accurate survey/floor plan |
| Reservations | Demo quote, atomic browser-local assignment, confirmation, cancellation, history |
| Staff operations | Demo check-in/out, room conditions, cash ledger, guest directory and moderation |
| Owner operations | Demo role assignments, hotel record editor and audit view |
| Real domain APIs | Not connected; intentionally fail closed in API mode |
| Invoices/refunds | No official invoice generation or refund workflow |
| Pricing administration | Sample catalogue values in code; no rate calendar or seasonal pricing editor |
| Uploads/email | No media upload or email delivery; backend work required |
| Reporting | Small operational dashboard; no full finance/reporting module |

## Inventory and business assumptions to confirm

- Earlier requirements mentioned 21 rooms; the revised room plan used 18.
  This package maps Suite 1–12 and Deluxe 13–18 only. Room 18 starts servicing.
  Do not infer a physical location or category for rooms 19–21. Confirm them before
  extending src/data/catalogue.ts, diagrams and capacity limits.
- Rates are illustrative: Suite LKR 18,000 and Deluxe LKR 14,000 per room/night.
  B&B adds 2,500; Half Board 5,500; Full Board 8,000 per room/night. These are sample
  pricing assumptions, not approved tariffs or a per-person meal calculation.
- Room sizes, galleries and other marketing specifics must be reviewed against
  the actual property. Stock photos do not demonstrate actual room facilities.
- Occupancy assumes at least one adult per room, up to two adults and one child
  per room. There are no child-age tiers or extra-bed fees yet.
- Cancellation is allowed for an unpaid confirmed booking before midnight in
  Asia/Colombo on check-in day. Paid bookings require staff contact. Replace with
  the hotel's approved cancellation/refund policy before release.
- No payment gateway. Cash receipt recording affects the local demo only.
- Check-out requires the balance to be paid; room then becomes dirty.
- Contact information, check-in/out windows, meal inclusions, shuttle terms and
  tourism claims require owner approval before publishing. The map link is a
  location search rather than a verified property pin.
- Staff hotel settings update the demo hotel record. The editorial homepage
  contact content still comes from appConfig; a shared real hotel response is
  needed to make all public content editable.
- Customer directory covers registered demo guest accounts, not a full normalized
  customer database or all anonymous reservation occupants.

## Demo data behavior

Data persists only in this browser. Sessions and anonymous booking access keys
are memory-only; reloading signs out and removes anonymous confirmation access.
Use a registered guest account to return to saved bookings after signing in.
Browser-local locking reduces simultaneous tab collisions but does not provide
server-side concurrency guarantees. Demo passwords use a simple demonstration
hash for newly registered accounts; this is not a production password design.
Never enter real identity documents into this demo. Only the last four document
characters are retained in reservation records.
