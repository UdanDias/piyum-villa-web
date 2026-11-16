# Backend integration boundary

No Java files are replaced by this package. Existing server source/contracts were
not available for a safe complete patch. The following are explicit next changes,
not a claim that the current backend already provides these routes.

## Existing authentication adapter

src/service/AuthService.ts calls:
- POST /auth/signin with email,password
- POST /auth/signup with username,name,email,phone,password
- GET /auth/me (adapter provided; not used to resolve roleId to permissions)

Signin/signup expect token,tokenType,expiresIn,userId,username,role. This matches
the displayed Postman auth response. The backend must assign GUEST on public
signup. Demo credentials never authenticate against the server. Tokens live only
in memory and are cleared on reload/expiry; refresh-token support is not supplied.

src/service/apiClient.ts owns the base URL, bearer header, timeout and error
normalization. No API call should embed /piyumvilla twice. CORS must allow the
actual frontend origin, normally http://localhost:3000.

## Required server contracts (proposals)

Agree these contracts against your actual DTOs before editing existing methods.
Use src/types/domain.ts as the frontend shape, and map server DTOs in the services.
Do not expose JPA entities directly.

| Capability | Server changes | Frontend adapter to replace |
| --- | --- | --- |
| Public hotel/catalogue | Read-only hotel, room type, accommodation and approved review projections | HotelService, RoomTypeService, AccommodationService, ReviewService |
| Availability | Date/occupancy query returning available IDs and category counts | ReservationService.availability, RoomService |
| Quote | Server-computed room/meal/tax totals, expiry and quote ID | ReservationService.quote |
| Confirm reservation | Atomic request with dates, room IDs/categories, occupants, meal plan, guest details, quote ID and idempotency key | ReservationService.create |
| My bookings/details/cancel | Ownership-enforced routes and cancellation policy | ReservationService |
| Anonymous booking access | Opaque expiring access token delivered through a secure email link; never ID alone | BookingDetailsPage and ReservationService |
| Staff check-in/out | Role and hotel scope checks, legal status transition, balance and room readiness validation | ReservationService |
| Room conditions | Operational/housekeeping fields and availability implications | RoomService |
| Cash payments | Server transaction, positive amount, overpayment prevention and audit | PaymentService |
| Customer/profile | Separate safe read/update DTOs and permissions | CustomerService |
| Review submission/moderation | Verified completed stay, one review per booking, moderation permissions | ReviewService |
| Roles and audit | Admin-only changes, last-admin protection, append-only audit | UserService, AuditLogService |

Changes belong in corresponding *Controller.java, *Service.java,
*ServiceImpl.java, *DAO.java and DTO files. Keep existing working methods; add
explicit request/response DTOs and endpoints rather than replacing entire
packages blindly. Actual filenames/packages must be checked against the backend
source before generating copy-paste patches.

Booking confirmation must recheck availability and price in a database transaction.
Lock all selected room rows in a stable order before overlap checking and inserting
reservations. Every writer must follow the same locking protocol. Persist the
idempotency key with a unique constraint. Never trust frontend totals, role checks,
room flags, browser dates or a locally generated booking reference.

## Images for hotels and rooms

Suggested new files:
- HotelImageEntity.java and RoomImageEntity.java
- HotelImageDAO.java and RoomImageDAO.java
- MediaDTO.java (id,url,altText,sortOrder,cover)
- MediaService.java, MediaServiceImpl.java and MediaController.java

Store image metadata in MySQL: ID, owning hotel/room FK, opaque storage key, MIME
type, size, alt text, sort order, cover flag and timestamps. Store image bytes in
object storage or a configured persistent directory outside the application JAR.
Expose a public read URL. For shared room-type galleries, add a RoomTypeImage
relationship rather than duplicating every photo for every physical room.

An authorized staff multipart upload endpoint should validate decoded image type,
size/dimensions and permissions, generate the filename/storage key, strip unwanted
metadata, produce thumbnails and persist the metadata. Do not accept arbitrary
filesystem paths. Restrict deletion and cover changes to authorized staff, and
coordinate storage cleanup with database failure handling. A hotel-level video
can use analogous metadata and separately limited upload rules.

When available, add media arrays to public DTOs and map them in RoomTypeService
and HotelService. Gallery.tsx already accepts image URLs. Replace local catalogue
image arrays and the HomePage video URL with real returned media.

## Switching off demo mode

Implement each domain adapter, remove its requireMock guard only when the HTTP
operation is implemented, and keep response normalization inside the service.
Do not catch a network error and fall back to demo records. Set DATA_MODE=api only
when the desired workflow is connected. There is no automatic demo-data migration.
