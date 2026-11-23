export const seasonalMotifs = {
  starlight: { path: 'M12 1 L14.5 9.5 L23 12 L14.5 14.5 L12 23 L9.5 14.5 L1 12 L9.5 9.5 Z', color: '#ffdbad', drift: -0.25 },
  hearts: { path: 'M12 21 C8 17 2 13 2 8 C2 3 8 2 12 7 C16 2 22 3 22 8 C22 13 16 17 12 21 Z', color: '#ff9b99', drift: -0.27 },
  petals: { path: 'M12 3 C16 3 22 8 20 13 C18 18 12 22 8 20 C4 18 4 11 12 3 Z', color: '#ffab91', drift: 0.44 },
  sunrise: { path: 'M2 16 H22 V18 H2 Z M6 14 A6 6 0 0 1 18 14 Z M11 3 H13 V6 H11 Z M3 7 L5 5 L7 8 L5 10 Z M17 8 L19 5 L21 7 L19 10 Z', color: '#ffd27b', drift: -0.34 },
  vesak: { path: 'M12 1 H13 V5 H15 L21 10 V15 L15 19 H13 V23 H11 V19 H9 L3 15 V10 L9 5 H11 V1 Z M12 7 L7 11 V14 L12 17 L17 14 V11 Z', color: '#ffce75', drift: -0.19 },
  moonlight: { path: 'M15 2 C6 1 1 7 3 15 C5 23 16 25 22 17 C14 20 7 11 15 2 Z', color: '#ffe8b1', drift: -0.2 },
  sunfire: { path: 'M12 1 L14 7 L20 4 L17 10 L23 12 L17 14 L20 20 L14 17 L12 23 L10 17 L4 20 L7 14 L1 12 L7 10 L4 4 L10 7 Z', color: '#ffc869', drift: -0.48 },
  sparks: { path: 'M14 2 L5 13 H11 L9 22 L20 10 H14 Z', color: '#ffab80', drift: -0.56 },
  harvest: { path: 'M12 23 V10 C9 8 8 4 12 1 C16 4 15 8 12 10 M12 15 C6 15 4 13 3 8 C8 8 11 10 12 15 M12 20 C17 20 21 16 21 12 C16 12 13 15 12 20 Z', color: '#e7bb74', drift: 0.33 },
  bonfire: { path: 'M12 1 C16 6 15 9 18 11 C19 9 20 9 20 8 C25 18 18 23 12 23 C5 23 1 18 5 10 C6 13 9 13 9 10 C9 7 11 5 12 1 Z', color: '#ff9559', drift: -0.53 },
  leaves: { path: 'M22 3 C19 10 20 18 10 20 L6 18 L2 22 L1 20 L6 16 C4 5 14 4 22 3 Z', color: '#de8d68', drift: 0.5 },
  christmas: { path: 'M11 1 H13 V23 H11 Z M2 6 L3 4 L22 18 L21 20 Z M22 6 L21 4 L2 18 L3 20 Z', color: '#fff4e9', drift: 0.83 },
};

export function createSeasonalDrift(season) {
  const motif = seasonalMotifs[season];
  if (!motif) return null;

  const snow = season === 'christmas';
  const path = new Path2D(motif.path);
  const count = snow ? 25 : season === 'vesak' ? 7 : 10;
  const pieces = Array.from({ length: count }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    phase: Math.random() * Math.PI * 2,
    size: snow ? 2 + Math.random() * 6 : 5 + Math.random() * 6,
    speed: motif.drift * (0.65 + Math.random() * 0.7),
    opacity: (snow ? 0.31 : 0.19) + Math.random() * 0.22,
    dot: snow && index % 4 !== 0,
  }));

  return function drawSeason(ctx, width, height, time, elapsed) {
    if (!width || !height) return;
    ctx.save();
    ctx.fillStyle = motif.color;
    for (const piece of pieces) {
      piece.y = ((piece.y + piece.speed * elapsed / height) % 1 + 1) % 1;
      const x = piece.x * width + Math.sin(time / 1400 + piece.phase) * 14;
      const y = piece.y * height;
      const fade = Math.min(1, piece.y * 20, (1 - piece.y) * 20);
      ctx.globalAlpha = piece.opacity * fade;
      ctx.save();
      ctx.translate(x, y);
      if (piece.dot) {
        ctx.beginPath();
        ctx.arc(0, 0, piece.size * 0.28, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.rotate(Math.sin(time / 1900 + piece.phase) * 0.4);
        ctx.scale(piece.size / 24, piece.size / 24);
        ctx.translate(-12, -12);
        ctx.fill(path, 'evenodd');
      }
      ctx.restore();
    }
    ctx.restore();
  };
}
