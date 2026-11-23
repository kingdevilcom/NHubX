import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { monthlyFireThemes } from '../fireTheme';
import { saveThemeSetting } from '../firebase';

export default function AdminThemeSettings({ fieldClass }) {
  const { theme, themeSetting } = useContent();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const selection = draft ?? themeSetting ?? 'auto';

  const publishTheme = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      await saveThemeSetting(selection);
      setDraft(null);
      setNotice('Theme published.');
    } catch (error) {
      setNotice('Unable to publish the theme. ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={publishTheme} className="glass rounded-2xl border border-white/10 p-6 space-y-4">
      <h3 className="text-xl font-bold">Website theme</h3>
      <p className="text-sm text-gray-300">Automatic rotation changes the fire palette each month on Sri Lanka time. Choose a fixed theme to keep it until you change this setting.</p>
      <label className="block">
        <span className="block text-sm mb-2">Theme preference</span>
        <select value={selection} onChange={(event) => { setDraft(event.target.value); setNotice(''); }} disabled={themeSetting === null || saving} className={fieldClass + ' [&>option]:bg-nhubx-bg-secondary'}>
          <option value="auto">Automatic monthly rotation</option>
          <option value="original">Original fire</option>
          {monthlyFireThemes.map(({ name }, index) => <option key={name} value={String(index + 1)}>{name}</option>)}
        </select>
      </label>
      <p className="text-sm text-gray-300">{themeSetting === null ? 'Loading the published theme…' : 'Active palette · ' + theme.name}</p>
      <button type="submit" disabled={saving || themeSetting === null || selection === themeSetting} className="rounded-xl bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 disabled:opacity-50 px-5 py-3 font-bold">
        {saving ? 'Publishing…' : 'Publish theme'}
      </button>
      <p role="status" className="text-sm text-gray-300">{notice}</p>
    </form>
  );
}
