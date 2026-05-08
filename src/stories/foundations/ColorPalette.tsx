type Swatch = { name: string; light: string; dark: string };
type Group = { group: string; swatches: Swatch[] };

const PALETTES: Group[] = [
  {
    group: 'Gray',
    swatches: [
      { name: 'gray-900', light: '#000000', dark: '#ffffff' },
      { name: 'gray-800', light: '#202124', dark: '#e7eaef' },
      { name: 'gray-700', light: '#40444c', dark: '#c9ced7' },
      { name: 'gray-600', light: '#626978', dark: '#a7adb9' },
      { name: 'gray-500', light: '#858c9b', dark: '#828998' },
      { name: 'gray-400', light: '#a5adbd', dark: '#4f5664' },
      { name: 'gray-300', light: '#cdd2dd', dark: '#2d333d' },
      { name: 'gray-200', light: '#eef1f6', dark: '#1d212a' },
      { name: 'gray-100', light: '#f7f8f9', dark: '#181b20' },
      { name: 'gray-75', light: '#fbfcff', dark: '#0f1115' },
      { name: 'gray-50', light: '#ffffff', dark: '#040506' },
    ],
  },
  {
    group: 'Blue',
    swatches: [
      { name: 'blue-1400', light: '#001c3c', dark: '#e3f3ff' },
      { name: 'blue-1300', light: '#002754', dark: '#ceeaff' },
      { name: 'blue-1200', light: '#003571', dark: '#b3defe' },
      { name: 'blue-1100', light: '#004491', dark: '#98cefd' },
      { name: 'blue-1000', light: '#0054b6', dark: '#7cbdfa' },
      { name: 'blue-900', light: '#0265dc', dark: '#5eaaf7' },
      { name: 'blue-800', light: '#147af3', dark: '#4096f3' },
      { name: 'blue-700', light: '#3892f3', dark: '#1d80f5' },
      { name: 'blue-600', light: '#59a7f6', dark: '#066ce7' },
      { name: 'blue-500', light: '#78bbfa', dark: '#005cc8' },
      { name: 'blue-400', light: '#96cefd', dark: '#004ea6' },
      { name: 'blue-300', light: '#b5deff', dark: '#004087' },
      { name: 'blue-200', light: '#cae8ff', dark: '#00326a' },
      { name: 'blue-100', light: '#e0f2ff', dark: '#002651' },
    ],
  },
  {
    group: 'Green',
    swatches: [
      { name: 'green-1400', light: '#0a2015', dark: '#d6f9e4' },
      { name: 'green-1200', light: '#053f27', dark: '#89ecbc' },
      { name: 'green-1000', light: '#00653e', dark: '#4bcd95' },
      { name: 'green-900', light: '#007a4d', dark: '#34bb84' },
      { name: 'green-800', light: '#008f5d', dark: '#1ca872' },
      { name: 'green-700', light: '#15a46e', dark: '#009562' },
      { name: 'green-600', light: '#2fb880', dark: '#008252' },
      { name: 'green-500', light: '#49cc93', dark: '#006f45' },
      { name: 'green-400', light: '#67dea8', dark: '#005d39' },
      { name: 'green-200', light: '#adf4ce', dark: '#073b24' },
      { name: 'green-100', light: '#cef8e0', dark: '#0a2c1c' },
    ],
  },
  {
    group: 'Red',
    swatches: [
      { name: 'red-1400', light: '#430000', dark: '#ffedea' },
      { name: 'red-1200', light: '#740000', dark: '#ffcdc3' },
      { name: 'red-1000', light: '#b40000', dark: '#ff9e8c' },
      { name: 'red-900', light: '#d31510', dark: '#ff816b' },
      { name: 'red-800', light: '#ea3829', dark: '#f9634c' },
      { name: 'red-700', light: '#f75c46', dark: '#ee4331' },
      { name: 'red-600', light: '#ff7c65', dark: '#dd2118' },
      { name: 'red-500', light: '#ff9b88', dark: '#c40706' },
      { name: 'red-400', light: '#ffb7a9', dark: '#a70000' },
      { name: 'red-200', light: '#ffddd6', dark: '#6e0000' },
      { name: 'red-100', light: '#ffebe7', dark: '#570000' },
    ],
  },
  {
    group: 'Orange',
    swatches: [
      { name: 'orange-1000', light: '#953d00', dark: '#ffa23b' },
      { name: 'orange-900', light: '#b14c00', dark: '#f98917' },
      { name: 'orange-800', light: '#cb5d00', dark: '#e87400' },
      { name: 'orange-700', light: '#e46f00', dark: '#d26200' },
      { name: 'orange-600', light: '#f68511', dark: '#ba5200' },
      { name: 'orange-500', light: '#ffa037', dark: '#a24400' },
      { name: 'orange-400', light: '#ffbb63', dark: '#8a3700' },
      { name: 'orange-300', light: '#fdd291', dark: '#732b00' },
      { name: 'orange-200', light: '#ffdfad', dark: '#5c2000' },
      { name: 'orange-100', light: '#ffeccc', dark: '#481801' },
    ],
  },
  {
    group: 'Amber',
    swatches: [
      { name: 'amber-1000', light: '#704300', dark: '#d79600' },
      { name: 'amber-900', light: '#855400', dark: '#c48600' },
      { name: 'amber-800', light: '#9b6200', dark: '#b07500' },
      { name: 'amber-600', light: '#c48600', dark: '#704300' },
      { name: 'amber-400', light: '#e8a600', dark: '#482900' },
      { name: 'amber-300', light: '#f8bf04', dark: '#281400' },
      { name: 'amber-200', light: '#f8ce50', dark: '#442f00' },
      { name: 'amber-100', light: '#fceab5', dark: '#352400' },
    ],
  },
  {
    group: 'Yellow',
    swatches: [
      { name: 'yellow-1000', light: '#705300', dark: '#d8b500' },
      { name: 'yellow-900', light: '#856600', dark: '#c7a200' },
      { name: 'yellow-600', light: '#c49f00', dark: '#8d6c00' },
      { name: 'yellow-400', light: '#e8c600', dark: '#674d00' },
      { name: 'yellow-300', light: '#f8d904', dark: '#563e00' },
      { name: 'yellow-200', light: '#f8e750', dark: '#442f00' },
      { name: 'yellow-100', light: '#fbf198', dark: '#352400' },
    ],
  },
  {
    group: 'Purple',
    swatches: [
      { name: 'purple-1000', light: '#7326d3', dark: '#cea6fd' },
      { name: 'purple-900', light: '#893de7', dark: '#c08ffc' },
      { name: 'purple-800', light: '#9d57f4', dark: '#b277fa' },
      { name: 'purple-700', light: '#ae72f9', dark: '#a25ef6' },
      { name: 'purple-500', light: '#cca4fd', dark: '#7e31de' },
      { name: 'purple-300', light: '#e6d0ff', dark: '#5610ad' },
      { name: 'purple-100', light: '#f6ebff', dark: '#321068' },
    ],
  },
  {
    group: 'Indigo',
    swatches: [
      { name: 'indigo-1000', light: '#4046ca', dark: '#aeb1ff' },
      { name: 'indigo-900', light: '#5258e4', dark: '#999dff' },
      { name: 'indigo-800', light: '#686df4', dark: '#8488fd' },
      { name: 'indigo-700', light: '#7e84fc', dark: '#6e73f6' },
      { name: 'indigo-500', light: '#acafff', dark: '#494ed8' },
      { name: 'indigo-300', light: '#d3d5ff', dark: '#2e329e' },
      { name: 'indigo-100', light: '#edeeff', dark: '#1a1d61' },
    ],
  },
  {
    group: 'Fuchsia',
    swatches: [
      { name: 'fuchsia-1000', light: '#9d039e', dark: '#f695f3' },
      { name: 'fuchsia-900', light: '#b622b7', dark: '#ef78ee' },
      { name: 'fuchsia-700', light: '#e055e2', dark: '#d341d5' },
      { name: 'fuchsia-400', light: '#fbaef6', dark: '#920093' },
      { name: 'fuchsia-200', light: '#ffdafa', dark: '#5d095c' },
      { name: 'fuchsia-100', light: '#ffe9fc', dark: '#460e44' },
    ],
  },
  {
    group: 'Magenta',
    swatches: [
      { name: 'magenta-1000', light: '#ad0955', dark: '#ff98bf' },
      { name: 'magenta-900', light: '#c82269', dark: '#fc7cad' },
      { name: 'magenta-700', light: '#ef5a98', dark: '#e34589' },
      { name: 'magenta-500', light: '#ff95bd', dark: '#ba165d' },
      { name: 'magenta-300', light: '#ffcadd', dark: '#850041' },
      { name: 'magenta-100', light: '#ffeaf1', dark: '#530329' },
    ],
  },
  {
    group: 'Cyan',
    swatches: [
      { name: 'cyan-1000', light: '#005d89', dark: '#39c7ea' },
      { name: 'cyan-900', light: '#00719f', dark: '#17b4dd' },
      { name: 'cyan-700', light: '#019cc8', dark: '#008cba' },
      { name: 'cyan-500', light: '#33c5e8', dark: '#006793' },
      { name: 'cyan-300', light: '#88e7fa', dark: '#00456c' },
      { name: 'cyan-100', light: '#c5f8ff', dark: '#002944' },
    ],
  },
  {
    group: 'Seafoam',
    swatches: [
      { name: 'seafoam-1000', light: '#00635f', dark: '#42cac3' },
      { name: 'seafoam-900', light: '#007772', dark: '#1ab9b2' },
      { name: 'seafoam-700', light: '#00a19a', dark: '#00928c' },
      { name: 'seafoam-500', light: '#3fc9c1', dark: '#006c68' },
      { name: 'seafoam-300', light: '#8ce9e2', dark: '#104946' },
      { name: 'seafoam-100', light: '#cef7f3', dark: '#122b2a' },
    ],
  },
];

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

interface SwatchCardProps {
  swatch: Swatch;
  mode: 'light' | 'dark';
}

function SwatchCard({ swatch, mode }: SwatchCardProps) {
  const hex = mode === 'light' ? swatch.light : swatch.dark;
  const textColor = isLight(hex) ? '#000000' : '#ffffff';

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#cdd2dd] shadow-sm">
      <div
        className="flex h-16 w-full items-end px-2 pb-1"
        style={{ backgroundColor: hex }}
      >
        <span className="font-mono text-[10px] font-medium" style={{ color: textColor }}>
          {hex}
        </span>
      </div>
      <div className="bg-white px-2 py-1.5">
        <p className="text-[11px] font-medium text-[#202124]">{swatch.name}</p>
      </div>
    </div>
  );
}

interface ColorPaletteProps {
  mode?: 'light' | 'dark';
}

export function ColorPalette({ mode = 'light' }: ColorPaletteProps) {
  return (
    <div className="space-y-10 p-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-[#202124]">MDS Primitive Colors</h1>
        <p className="mt-1 text-sm text-[#626978]">
          Full color palette from the Mystic Design System · {mode === 'light' ? 'Light' : 'Dark'} mode values
        </p>
      </div>

      {PALETTES.map(({ group, swatches }) => (
        <div key={group}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#626978]">
            {group}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
            {swatches.map((swatch) => (
              <SwatchCard key={swatch.name} swatch={swatch} mode={mode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
