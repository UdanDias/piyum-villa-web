import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingProvider';
import { ReservationService } from '../service/ReservationService';
import { nightsBetween, errorMessage } from '../utils/format';
import { allocationErrors, withAllocations } from '../utils/occupancy';
import { Alert } from './UI';
import { GuestRooms } from './GuestRooms';
import { DateRangePicker } from './DateRangePicker';
import type { Availability } from '../types/domain';
export function AvailabilitySearch() {
  const { draft, setDraft } = useBooking(); const navigate = useNavigate(); const root=useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<Availability>(); const [busy,setBusy]=useState(false); const [error,setError]=useState(''); const [popover,setPopover]=useState(false); const [errors,setErrors]=useState<string[]>([]);
  const update=(next: typeof draft) => { setDraft(next); setResult(undefined); setError(''); setErrors([]); };
  function validate() { const list=allocationErrors(draft.allocations); setErrors(list); if(list.some(Boolean)){setPopover(true);window.setTimeout(()=>root.current?.querySelectorAll<HTMLElement>('[data-room]')[list.findIndex(Boolean)]?.focus(),0);return false;} return true; }
  async function search(event: React.FormEvent) { event.preventDefault(); if(!validate())return;setPopover(false);setBusy(true);setError('');setResult(undefined);try {setResult(await ReservationService.availability(draft));}catch(e){setError(errorMessage(e));}finally{setBusy(false);} }
  const guests=draft.adults+draft.children;
  return <div className="availability-shell" ref={root}><form className="availability-bar" onSubmit={search}><DateRangePicker start={draft.checkIn} end={draft.checkOut} onChange={(checkIn,checkOut)=>update({...draft,checkIn,checkOut,selectedRoomIds:[],selectRooms:false})}/><div className="room-popover-wrap"><button type="button" className="room-trigger" aria-expanded={popover} onClick={()=>setPopover(!popover)}><span>GUESTS & ROOMS</span><strong>{guests} Guest{guests!==1?'s':''} · {draft.rooms} Room{draft.rooms!==1?'s':''} ⌄</strong></button>{popover && <div className="room-popover" role="region" aria-label="Room guest allocation"><GuestRooms rooms={draft.allocations} errors={errors} onChange={rooms=>update(withAllocations(draft,rooms))}/><button type="button" className="button full" onClick={()=>{if(validate())setPopover(false);}}>Apply</button></div>}</div><button className="button search-button" disabled={busy}>{busy?'Checking…':'See availability'} ↗</button></form><div className="search-footnote"><span>{nightsBetween(draft.checkIn,draft.checkOut)>0?`${nightsBetween(draft.checkIn,draft.checkOut)} nights of a slower pace`:'Choose your dates'}</span><span>Cash at the property</span></div>{error&&<Alert>{error}</Alert>}{result&&<div className="availability-result" role="status"><p>{result.total<draft.rooms?`Sorry, there are only ${result.total} rooms left.`:`${draft.rooms} room(s) available for your stay.`}</p>{result.total>=draft.rooms?<button className="button" type="button" onClick={()=>navigate('/accommodation#reserve')}>Proceed to booking →</button>:<button className="button outline" type="button" onClick={()=>setPopover(true)}>Adjust your rooms</button>}</div>}</div>;
}
