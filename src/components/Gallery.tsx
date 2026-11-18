import { useState } from 'react';
import { Photo, Dialog } from './UI';
export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0); const [open, setOpen] = useState(false);
  return <><div className="gallery"><button className="gallery-open" type="button" aria-label={`Enlarge ${name} gallery`} onClick={() => setOpen(true)}><Photo src={images[index]} alt={`${name} gallery ${index + 1}`} /></button><div className="gallery-controls"><button type="button" aria-label="Previous photo" onClick={() => setIndex((index - 1 + images.length) % images.length)}>←</button><span aria-live="polite">{index + 1} / {images.length}</span><button type="button" aria-label="Next photo" onClick={() => setIndex((index + 1) % images.length)}>→</button></div></div><Dialog open={open} title={name} onClose={() => setOpen(false)}><Photo className="gallery-large" src={images[index]} alt={`${name} image`} /></Dialog></>;
}
