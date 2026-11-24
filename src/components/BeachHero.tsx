import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from './UI';

const base = process.env.PUBLIC_URL ?? '';
const poster = `${base}/assets/images/beach-hero.jpg`;
const movie = `${base}/assets/video/beach-hero.mp4`;

export function BeachHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hidden, setHidden] = useState(document.hidden);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(media.matches);
    const visibility = () => setHidden(document.hidden);
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      media.removeEventListener('change', motion);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (paused || reduced || hidden || failed) element.pause();
    else {
      element.muted = true;
      void element.play().catch(() => setPlaying(false));
    }
  }, [paused, reduced, hidden, failed]);

  function togglePlayback() {
    const element = video.current;
    if (!element) return;
    if (playing) { setPaused(true); element.pause(); }
    else {
      setPaused(false);
      element.muted = true;
      void element.play().catch(() => setPlaying(false));
    }
  }

  return <section className="hero" aria-label="Piyum Villa coastal welcome">
    <img className="hero-poster" src={poster} alt="Illustrative tropical beach with golden light, turquoise surf and coconut palms" loading="eager" />
    {!reduced && !failed && <video ref={video} className="hero-video" src={movie}
      poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { setFailed(true); setPlaying(false); }} />}
    <div className="hero-shade" style={{background:'linear-gradient(90deg,rgba(22,29,28,.58),rgba(22,29,28,.08)),linear-gradient(0deg,rgba(22,29,28,.35),transparent 65%)'}} />
    <div className="container hero-copy">
      <Eyebrow>WELIGAMA, SRI LANKA</Eyebrow>
      <h1>Stay a little.<br/><em>Feel a world away.</em></h1>
      <p>Quiet garden mornings. Saltwater afternoons.<br/>Your own little corner of surfers paradise.</p>
      <a href="#find-stay" className="hero-link">Find your slow days <span>↓</span></a>
    </div>
    <div className="hero-bottom">
      <span>06° N &nbsp; / &nbsp; THE SOUTHERN COAST</span>
      {reduced || failed ? <span>{reduced ? 'Still image · reduced motion' : 'Beach view'}</span> :
        <button type="button" className="video-toggle" onClick={togglePlayback}
          aria-label={playing ? 'Pause beach animation' : 'Play beach animation'}>
          {playing ? 'Ⅱ Pause animation' : '▷ Play animation'}
        </button>}
    </div>
  </section>;
}
