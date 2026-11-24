import { getAuth } from 'firebase/auth';
import { app } from './firebase';

export async function orderRequest(action, input = {}) {
  const token = await getAuth(app).currentUser?.getIdToken();
  if (!token) throw new Error('Sign in to view orders.');
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...input }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.error || 'Orders are temporarily unavailable.');
  return data.result;
}

export const formatLkr = (value) => 'LKR ' + new Intl.NumberFormat('en-LK').format(value);
export const stages = ['Quote sent', 'Accepted', 'In progress', 'Review', 'Delivered'];
export const orderField = 'w-full min-w-0 rounded-lg border border-white/15 bg-[#151515] px-3 py-2 text-sm text-white';
export const orderButton = 'rounded-lg bg-nhubx-glow-primary px-4 py-2.5 text-sm font-semibold disabled:opacity-50';
