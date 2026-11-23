import { Flame } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="site-loading" role="status">
      <Flame size={34} aria-hidden="true" />
      <span>Loading NHubX…</span>
    </div>
  );
}
