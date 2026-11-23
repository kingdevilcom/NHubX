const original = { name: 'Original fire', primary: '255 60 0', secondary: '255 122 0', emberShift: 0, hover: '249 115 22' };

export const monthlyFireThemes = [
  ['January · Emberlight', '249 82 36', '255 135 63', 2],
  ['February · Rosefire', '246 62 79', '255 118 100', -15],
  ['March · Copper Spark', '232 93 40', '255 157 83', 4],
  ['April · Golden Flame', '246 112 7', '255 173 42', 10],
  ['May · Lantern Glow', '237 102 27', '255 150 69', 8],
  ['June · Solstice Fire', '242 120 21', '255 186 75', 14],
  ['July · Sunfire', '255 95 0', '255 155 38', 7],
  ['August · Kiln Heat', '235 64 34', '252 124 72', -2],
  ['September · Harvest Ember', '231 104 14', '251 167 58', 11],
  ['October · Bonfire', '255 79 3', '255 133 20', 3],
  ['November · Ember Dusk', '245 72 23', '255 140 66', 1],
  ['December · Hearth Glow', '238 58 46', '255 118 72', -7],
].map(([name, primary, secondary, emberShift]) => ({ name, primary, secondary, emberShift }));

const colomboMonth = new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Colombo' });

export function normalizeThemeSetting(setting) {
  if (setting === 'original') return setting;
  return monthlyFireThemes.some((_, index) => String(index + 1) === setting) ? setting : 'auto';
}

export function resolveFireTheme(setting, date = new Date()) {
  const selection = normalizeThemeSetting(setting);
  if (selection === 'original') return original;
  const month = selection === 'auto' ? colomboMonth.format(date) : selection;
  return monthlyFireThemes[Number(month) - 1];
}
