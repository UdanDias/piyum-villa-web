import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useResource } from "../hooks/useResource";
import { ReservationService } from "../service/ReservationService";
import { PageTitle, Loading, Alert, Status, Empty } from "../components/UI";
import { money, today, dateLabel } from "../utils/format";
export function StaffDashboard() {
  const { session } = useAuth();
  const data = useResource(ReservationService.getAll);
  if (session?.user.role === "HOUSEKEEPING")
    return <Navigate to="/staff/rooms" replace />;
  const bookings = data.data ?? [];
  const arrivals = bookings.filter(
    (b) => b.draft.checkIn === today() && b.status === "confirmed",
  );
  const departures = bookings.filter(
    (b) => b.draft.checkOut === today() && b.status === "checked-in",
  );
  const inHouse = bookings.filter((b) => b.status === "checked-in");
  const outstanding = bookings
    .filter((b) => ["confirmed", "checked-in"].includes(b.status))
    .reduce((n, b) => n + b.quote.total - b.paid, 0);
  return (
    <>
      <PageTitle eyebrow="AT A GLANCE" title="A good day starts here.">
        Your hotel, your guests, everything in view.
      </PageTitle>
      {data.loading ? (
        <Loading />
      ) : data.error ? (
        <Alert>{data.error}</Alert>
      ) : (
        <>
          <div className="four-grid stats">
            {[
              ["Arrivals today", arrivals.length],
              ["Departures today", departures.length],
              ["In-house bookings", inHouse.length],
              ["Outstanding balance", money(outstanding)],
            ].map(([label, value]) => (
              <article className="panel" key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
          <section className="panel">
            <div className="row-between">
              <h2>Upcoming stays</h2>
              <Link className="text-link" to="/staff/reservations">
                All reservations →
              </Link>
            </div>
            {!bookings.filter((b) => b.status === "confirmed").length ? (
              <Empty title="No upcoming reservations" />
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Reference / guest</th>
                      <th>Arrival</th>
                      <th>Rooms</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .filter((b) => b.status === "confirmed")
                      .sort((a, b) =>
                        a.draft.checkIn.localeCompare(b.draft.checkIn),
                      )
                      .slice(0, 6)
                      .map((b) => (
                        <tr key={b.id}>
                          <td>
                            <b>{b.reference}</b>
                            <small>{b.guest.name}</small>
                            <small
                              style={{
                                display: "block",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {b.guest.email || "No email provided"}
                            </small>
                          </td>
                          <td>{dateLabel(b.draft.checkIn)}</td>
                          <td>{b.draft.rooms}</td>
                          <td>
                            <Status value={b.status} />
                          </td>
                          <td>
                            <Link
                              className="text-link"
                              to="/staff/reservations"
                            >
                              Open →
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <div className="panel inline-note">
            This dashboard lists website bookings created through the integrated
            flow. Older staff-created reservations remain accessible through the
            existing reservation APIs. Refunds, service charges and complex
            invoice adjustments remain in the accounting APIs.
          </div>
        </>
      )}
    </>
  );
}
