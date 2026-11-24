import { useEffect, useState } from 'react';
import { AccommodationService } from '../service/AccommodationService';
import { useResource } from '../hooks/useResource';
import { Alert } from './UI';
import { errorMessage } from '../utils/format';
export function MealRateEditor(){
 const plans=useResource(AccommodationService.getAll);
 const [rows,setRows]=useState<{id:string;name:string;adult:string;child:string}[]>([]);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState('');
 useEffect(()=>{if(plans.data)setRows(plans.data.filter(p=>p.id!=='room-only').map(p=>({id:p.id,name:p.name,adult:String(p.adultSupplement),child:String(p.childSupplement)})));},[plans.data]);
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');setSuccess('');try{await AccommodationService.updatePrices(rows.map(p=>({id:p.id,adultSupplement:Number(p.adult),childSupplement:Number(p.child)})));setSuccess('Meal prices saved. New quotes use these amounts; existing bookings retain their confirmed totals.');}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 return <form className="panel form-panel" onSubmit={save}><h2>Website meal supplements</h2><p>Per person, per night. Room Only has no supplement. Half Board includes breakfast and dinner.</p>{plans.error&&<Alert>{plans.error}</Alert>}{rows.map(row=><fieldset key={row.id} disabled={busy}><legend>{row.name}</legend><div className="form-grid">{(['adult','child'] as const).map(key=><label key={key}>{key==='adult'?'Adult':'Child'} supplement (LKR)<input type="number" required min="0" max="9999999999.99" step="0.01" value={row[key]} onChange={e=>setRows(rows.map(r=>r.id===row.id?{...r,[key]:e.target.value}:r))}/></label>)}</div></fieldset>)}{error&&<Alert>{error}</Alert>}{success&&<Alert success>{success}</Alert>}<button className="button" disabled={busy||rows.length!==3}>{busy?'Saving…':'Save meal prices'}</button></form>;
}
