import FireParticles from './FireParticles';

export default function LoadingScreen() {
  return (
    <div role="status" className="fixed inset-0 z-[9999] bg-nhubx-bg-primary flex flex-col items-center justify-center">
      <FireParticles zIndex={1} />
      <div className="relative z-10">
        <p className="text-6xl md:text-8xl font-black tracking-tighter animate-glitch mb-8">
          NHUB<span className="text-nhubx-glow-primary">X</span>
        </p>
        <div aria-hidden="true" className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-nhubx-glow-primary shadow-glow motion-safe:animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-mono text-gray-300 tracking-widest">Loading NHubX…</p>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgb(var(--fire-primary)/0.05)_0%,transparent_70%)]" />
    </div>
  );
}
