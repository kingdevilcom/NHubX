// A year of fire-inspired palettes, from winter embers to December hearth.
const firePalettes = [
  ['Winter embers', '255 157 118', '255 204 145', '21 14 17'],
  ['Rose flame', '255 135 155', '255 181 160', '26 13 22'],
  ['Wildfire', '255 145 98', '255 192 111', '23 15 12'],
  ['Golden spark', '247 198 105', '255 224 153', '24 19 12'],
  ['Copper glow', '241 165 112', '255 207 156', '24 16 13'],
  ['Solstice flame', '255 178 79', '255 220 120', '25 18 10'],
  ['Sunfire', '255 144 76', '255 205 115', '26 15 10'],
  ['Kiln heat', '242 140 108', '255 183 140', '26 14 12'],
  ['Lantern glow', '255 189 122', '255 220 167', '25 17 12'],
  ['Bonfire', '255 134 92', '255 178 94', '27 13 10'],
  ['Ember dusk', '255 155 108', '255 191 137', '20 13 15'],
  ['Hearth glow', '250 141 126', '255 201 153', '25 14 16'],
];

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  timeZone: 'Asia/Colombo',
});

export function getFireTheme(date = new Date()) {
  const month = Number(monthFormatter.format(date));
  const [name, accent, highlight, background] = firePalettes[month - 1];

  return { month, name, accent, highlight, background };
}

export function getFireThemeProperties({ accent, highlight, background }) {
  return {
    '--fire-accent': accent,
    '--fire-highlight': highlight,
    '--fire-background': background,
  };
}
