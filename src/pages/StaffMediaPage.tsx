import { useState } from 'react';
import { MediaService, mediaUrl } from '../service/MediaService';
import { HotelService } from '../service/HotelService';
import { RoomTypeService } from '../service/RoomTypeService';
import { RoomService } from '../service/RoomService';
import { useResource } from '../hooks/useResource';
import { PageTitle, Alert, Photo } from '../components/UI';
import { errorMessage } from '../utils/format';
export function StaffMediaPage() {
 const media=useResource(MediaService.getAll), hotel=useResource(HotelService.getPublic), types=useResource(RoomTypeService.getAll), rooms=useResource(RoomService.getAll);
 const [owner,setOwner]=useState(''),[alt,setAlt]=useState(''),[file,setFile]=useState<File>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState('');
 async function upload(e:React.FormEvent){e.preventDefault();if(!file)return;setBusy(true);setError('');setSuccess('');try{const [kind,id]=owner.split(':');await MediaService.upload(kind,Number(id),alt,file);setSuccess('Image uploaded.');}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 async function remove(id:number){if(!window.confirm('Delete this photo?'))return;setBusy(true);try{await MediaService.remove(id);}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 return <><PageTitle eyebrow="PROPERTY GALLERY" title="Hotel & room photos">Manage hotel and room photographs. The earliest hotel photo becomes the homepage hero poster.</PageTitle><form className="panel form-panel narrow" onSubmit={upload}><label>Attach image to<select required value={owner} onChange={e=>setOwner(e.target.value)}><option value="">Choose an owner</option>{hotel.data?.id && <option value={`hotel:${hotel.data.id}`}>Hotel / homepage hero</option>}{types.data?.map(t=><option key={t.id} value={`room-type:${t.databaseId}`}>{t.name} gallery</option>)}{rooms.data?.map(r=><option key={r.id} value={`room:${r.id}`}>Room {r.number}</option>)}</select></label><label>Description for accessibility<input maxLength={200} required value={alt} onChange={e=>setAlt(e.target.value)}/></label><label>JPEG or PNG, up to 5 MB<input type="file" accept="image/jpeg,image/png" required onChange={e=>setFile(e.target.files?.[0])}/></label>{error&&<Alert>{error}</Alert>}{success&&<Alert success>{success}</Alert>}<button className="button" disabled={busy}>{busy?'Working…':'Upload photo'}</button></form>{media.error&&<Alert>{media.error}</Alert>}<div className="three-grid section">{media.data?.map(m=><article className="panel" key={m.id}><Photo src={mediaUrl(m)} alt={m.altText} style={{width:'100%',height:180,objectFit:'cover'}}/><h3>{m.altText}</h3><p>{m.ownerType} #{m.ownerId}</p><button className="button outline" disabled={busy} onClick={()=>remove(m.id)}>Delete photo</button></article>)}</div></>;
}
