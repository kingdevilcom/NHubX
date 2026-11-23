import { useEffect } from 'react';
import { seasonalMotifs } from '../seasonalMotifs';

export function SeasonalLogoMark({ season }) {
  const motif = seasonalMotifs[season];
  if (!motif) return null;

  return (
    <svg aria-hidden="true" className="seasonal-logo-mark" data-logo-season={season} viewBox="0 0 24 24">
      {season === 'christmas' ? (
        <>
          <path d="M3 16C4 8 9 3 15 4c4 1 6 4 6 7l-3 1c-1-2-2-2-3-2l2 7Z" fill="#ef413b" stroke="#8e211c" strokeWidth="1" />
          <path d="M3 16c4-2 10-2 15 0l-1 4c-5-1-9-1-14 0Z" fill="#fff6e9" />
          <circle cx="21" cy="11" r="2.4" fill="#fff6e9" />
        </>
      ) : (
        <path d={motif.path} fill={motif.color} fillRule="evenodd" />
      )}
    </svg>
  );
}

export function VesakFooterDecorations() {
  return (
    <div aria-hidden="true" className="vesak-footer-decorations">
      <svg className="vesak-footer-lantern" viewBox="0 0 24 24">
        <path d={seasonalMotifs.vesak.path} fill="#ffce75" fillRule="evenodd" />
      </svg>
      <svg className="vesak-footer-pahan" viewBox="0 0 24 24">
        <path d="M3 15h18c-1 4-4 6-9 6s-8-2-9-6Z" fill="#cc7947" />
        <path d="M12 4c2 3 4 5 4 8a4 4 0 0 1-8 0c0-2 2-5 4-8Z" fill="#ffd472" />
        <path d="M12 10c1 1 2 2 2 3a2 2 0 0 1-4 0c0-1 1-2 2-3Z" fill="#fff4d3" />
      </svg>
    </div>
  );
}

const snowActions = '[data-season="christmas"] :is(a.bg-nhubx-glow-primary, button.bg-nhubx-glow-primary, [data-seasonal-snow])';

export function useChristmasMelt(season) {
  useEffect(() => {
    if (season !== 'christmas') return undefined;

    let frame = 0;
    let pointer = null;
    let warmed = new Set();

    function updateSnow() {
      frame = 0;
      const next = new Set();
      if (pointer) {
        for (const action of document.querySelectorAll(snowActions)) {
          const { left, right, top, bottom, width, height } = action.getBoundingClientRect();
          if (!width || !height) continue;
          const dx = Math.max(left - pointer.x, 0, pointer.x - right);
          const dy = Math.max(top - pointer.y, 0, pointer.y - bottom);
          if (Math.hypot(dx, dy) <= 36) next.add(action);
        }
      }
      for (const action of warmed) {
        if (!next.has(action)) action.removeAttribute('data-snow-melting');
      }
      for (const action of next) {
        if (!warmed.has(action)) action.setAttribute('data-snow-melting', '');
      }
      warmed = next;
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(updateSnow);
    }

    function move(event) {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    }

    function clear() {
      pointer = null;
      schedule();
    }

    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', clear);
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('blur', clear);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', clear);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('blur', clear);
      for (const action of warmed) action.removeAttribute('data-snow-melting');
    };
  }, [season]);
}
