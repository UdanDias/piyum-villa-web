import { useEffect, useState } from 'react';
import { Photo, Dialog } from './UI';
import { fallbackImage } from '../config/appConfig';

const SLIDE_INTERVAL = 5000;

export function Gallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const photos = images.length ? images : [fallbackImage];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const current = index % photos.length;
  const multiple = photos.length > 1;
  const photoListKey = JSON.stringify(images);

  // Start at the first photo when uploaded images change.
  useEffect(() => {
    setIndex(0);
  }, [photoListKey]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = () => setReducedMotion(media.matches);
    const handleVisibility = () => setHidden(document.hidden);

    media.addEventListener('change', handleMotion);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      media.removeEventListener('change', handleMotion);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (
      !multiple ||
      paused ||
      hovered ||
      focused ||
      hidden ||
      open ||
      reducedMotion
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIndex(value => (value + 1) % photos.length);
    }, SLIDE_INTERVAL);

    return () => window.clearTimeout(timer);
  }, [
    index,
    photos.length,
    multiple,
    paused,
    hovered,
    focused,
    hidden,
    open,
    reducedMotion,
  ]);

  function move(direction: number) {
    setIndex(value =>
      (value + direction + photos.length) % photos.length
    );
  }

  return (
    <>
      <div
        className="gallery"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false);
          }
        }}
      >
        <button
          className="gallery-open"
          type="button"
          aria-label={`Enlarge ${name} photo ${current + 1}`}
          onClick={() => setOpen(true)}
          style={{ overflow: 'hidden' }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              transform: `translateX(-${current * 100}%)`,
              transition: reducedMotion
                ? 'none'
                : 'transform 650ms ease-in-out',
            }}
          >
            {photos.map((src, photoIndex) => (
              <div
                key={`${src}-${photoIndex}`}
                aria-hidden={photoIndex !== current}
                style={{ flex: '0 0 100%', minWidth: 0 }}
              >
                <Photo
                  src={src}
                  alt={`${name} photo ${photoIndex + 1}`}
                  loading={photoIndex === current ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </button>

        {multiple && (
          <div className="gallery-controls">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => move(-1)}
            >
              ←
            </button>

            <span>
              {current + 1} / {photos.length}
            </span>

            <button
              type="button"
              aria-label="Next photo"
              onClick={() => move(1)}
            >
              →
            </button>

            {!reducedMotion && (
              <button
                type="button"
                aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
                title={paused ? 'Resume slideshow' : 'Pause slideshow'}
                onClick={() => setPaused(value => !value)}
              >
                {paused ? '▶' : 'Ⅱ'}
              </button>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} title={name} onClose={() => setOpen(false)}>
        <Photo
          className="gallery-large"
          src={photos[current]}
          alt={`${name} photo ${current + 1}`}
        />
      </Dialog>
    </>
  );
}