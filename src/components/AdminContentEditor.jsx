import React, { useEffect, useState } from 'react';
import { Save, Loader2, Plus, X } from 'lucide-react';
import { defaultSiteContent, fetchSiteContent, saveSiteContent } from '../firebase';
import { useContent } from '../context/ContentContext';

const AdminContentEditor = () => {
  const [content, setContent] = useState(defaultSiteContent);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const { refreshContent } = useContent();

  useEffect(() => {
    fetchSiteContent().then(setContent).catch((error) => setNotice({ type: 'error', text: error.message })).finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setContent((current) => ({ ...current, [field]: value }));
  const handleSave = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await saveSiteContent(content);
      await refreshContent();
      setNotice({ type: 'success', text: 'Content published successfully.' });
    } catch (error) {
      setNotice({ type: 'error', text: `Unable to save content: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };
  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || content.skills.includes(skill)) return;
    update('skills', [...content.skills, skill]);
    setSkillInput('');
  };

  if (loading) return <div className="py-16 text-center text-gray-400"><Loader2 className="w-9 h-9 mx-auto mb-3 animate-spin text-nhubx-glow-primary" />Loading published content...</div>;
  const fieldClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-nhubx-glow-primary/50';

  return (
    <div className="space-y-6">
      {notice && <div className={`rounded-xl border p-4 ${notice.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>{notice.text}</div>}
      <section className="glass rounded-2xl border border-white/10 p-6 space-y-4"><h3 className="text-xl font-bold">Homepage</h3><input className={fieldClass} value={content.heroTitle} onChange={(event) => update('heroTitle', event.target.value)} placeholder="Hero title" /><input className={fieldClass} value={content.heroSubtitle} onChange={(event) => update('heroSubtitle', event.target.value)} placeholder="Hero subtitle" /></section>
      <section className="glass rounded-2xl border border-white/10 p-6 space-y-4"><h3 className="text-xl font-bold">About NHubX</h3><input className={fieldClass} value={content.aboutTitle} onChange={(event) => update('aboutTitle', event.target.value)} placeholder="About title" /><textarea className={fieldClass} rows="5" value={content.aboutDescription} onChange={(event) => update('aboutDescription', event.target.value)} placeholder="About description" /></section>
      <section className="glass rounded-2xl border border-white/10 p-6 space-y-4"><h3 className="text-xl font-bold">Developer profile</h3><div className="grid md:grid-cols-2 gap-4"><input className={fieldClass} value={content.developerName} onChange={(event) => update('developerName', event.target.value)} placeholder="Developer name" /><input className={fieldClass} value={content.developerRole} onChange={(event) => update('developerRole', event.target.value)} placeholder="Role" /></div><textarea className={fieldClass} rows="5" value={content.developerBio} onChange={(event) => update('developerBio', event.target.value)} placeholder="Developer biography" /><div className="flex gap-2"><input className={fieldClass} value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSkill(); } }} placeholder="Add a skill" /><button onClick={addSkill} className="px-4 rounded-xl bg-nhubx-glow-primary"><Plus /></button></div><div className="flex flex-wrap gap-2">{content.skills.map((skill) => <span key={skill} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm">{skill}<button onClick={() => update('skills', content.skills.filter((item) => item !== skill))}><X size={14} /></button></span>)}</div></section>
      <section className="glass rounded-2xl border border-white/10 p-6 space-y-4"><h3 className="text-xl font-bold">Contact links</h3>{Object.entries(content.socialLinks).map(([name, value]) => <label key={name} className="block"><span className="block text-xs uppercase tracking-wider text-gray-400 mb-2">{name}</span><input className={fieldClass} value={value} onChange={(event) => update('socialLinks', { ...content.socialLinks, [name]: event.target.value })} /></label>)}</section>
      <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-nhubx-glow-primary hover:bg-nhubx-glow-primary/80 disabled:opacity-50 font-bold">{saving ? <Loader2 className="animate-spin" /> : <Save />} {saving ? 'Publishing...' : 'Publish all changes'}</button>
    </div>
  );
};

export default AdminContentEditor;
