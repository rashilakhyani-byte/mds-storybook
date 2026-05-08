// Primitive color lookup (Light mode values only — dark resolved separately)
const PRIMITIVE: Record<string, { light: string; dark: string }> = {
  '-mds-gray/gray-900': { light: '#000000', dark: '#ffffff' },
  '-mds-gray/gray-800': { light: '#202124', dark: '#e7eaef' },
  '-mds-gray/gray-700': { light: '#40444c', dark: '#c9ced7' },
  '-mds-gray/gray-600': { light: '#626978', dark: '#a7adb9' },
  '-mds-gray/gray-500': { light: '#858c9b', dark: '#828998' },
  '-mds-gray/gray-400': { light: '#a5adbd', dark: '#4f5664' },
  '-mds-gray/gray-300': { light: '#cdd2dd', dark: '#2d333d' },
  '-mds-gray/gray-200': { light: '#eef1f6', dark: '#1d212a' },
  '-mds-gray/gray-100': { light: '#f7f8f9', dark: '#181b20' },
  '-mds-gray/gray-75': { light: '#fbfcff', dark: '#0f1115' },
  '-mds-gray/gray-50': { light: '#ffffff', dark: '#040506' },
  '-mds-blue/blue-1200': { light: '#003571', dark: '#b3defe' },
  '-mds-blue/blue-1000': { light: '#0054b6', dark: '#7cbdfa' },
  '-mds-blue/blue-900': { light: '#0265dc', dark: '#5eaaf7' },
  '-mds-blue/blue-600': { light: '#59a7f6', dark: '#066ce7' },
  '-mds-blue/blue-500': { light: '#78bbfa', dark: '#005cc8' },
  '-mds-blue/blue-200': { light: '#cae8ff', dark: '#00326a' },
  '-mds-blue/blue-100': { light: '#e0f2ff', dark: '#002651' },
  '-mds-indigo/indigo-700': { light: '#7e84fc', dark: '#6e73f6' },
  '-mds-red/red-900': { light: '#d31510', dark: '#ff816b' },
  '-mds-red/red-600': { light: '#ff7c65', dark: '#dd2118' },
  '-mds-red/red-400': { light: '#ffb7a9', dark: '#a70000' },
  '-mds-red/red-200': { light: '#ffddd6', dark: '#6e0000' },
  '-mds-green/green-900': { light: '#007a4d', dark: '#34bb84' },
  '-mds-green/green-400': { light: '#67dea8', dark: '#005d39' },
  '-mds-green/green-100': { light: '#cef8e0', dark: '#0a2c1c' },
};

function resolve(alias: string, mode: 'light' | 'dark'): string {
  const key = alias.startsWith('@') ? alias.slice(1) : alias;
  return PRIMITIVE[key]?.[mode] ?? alias;
}

interface Token { name: string; lightAlias: string; darkAlias: string }

const SURFACE_TOKENS: Token[] = [
  { name: 'Surface/Default/Underground', lightAlias: '@-mds-gray/gray-100', darkAlias: '@-mds-gray/gray-50' },
  { name: 'Surface/Default/Ground', lightAlias: '@-mds-gray/gray-50', darkAlias: '@-mds-gray/gray-100' },
  { name: 'Surface/Default/L1', lightAlias: '@-mds-gray/gray-50', darkAlias: '@-mds-gray/gray-200' },
  { name: 'Surface/Default/L2', lightAlias: '@-mds-gray/gray-75', darkAlias: '#252b36' },
  { name: 'Surface/Default/Action', lightAlias: '@-mds-blue/blue-1000', darkAlias: '@-mds-blue/blue-600' },
  { name: 'Surface/Default/Action Hover', lightAlias: '@-mds-blue/blue-1200', darkAlias: '@-mds-blue/blue-500' },
  { name: 'Surface/Hover (all)', lightAlias: '@-mds-gray/gray-200', darkAlias: '@-mds-gray/gray-300' },
];

const TEXT_TOKENS: Token[] = [
  { name: 'Text/Stark', lightAlias: '@-mds-gray/gray-900', darkAlias: '@-mds-gray/gray-900' },
  { name: 'Text/Default', lightAlias: '@-mds-gray/gray-800', darkAlias: '@-mds-gray/gray-800' },
  { name: 'Text/Subtle', lightAlias: '@-mds-gray/gray-700', darkAlias: '@-mds-gray/gray-700' },
  { name: 'Text/Subdued', lightAlias: '@-mds-gray/gray-600', darkAlias: '@-mds-gray/gray-600' },
  { name: 'Text/Disabled', lightAlias: '@-mds-gray/gray-500', darkAlias: '@-mds-gray/gray-500' },
];

const STROKE_TOKENS: Token[] = [
  { name: 'Stroke-Section', lightAlias: '@-mds-gray/gray-300', darkAlias: '@-mds-gray/gray-300' },
  { name: 'Stroke-Subsection', lightAlias: '@-mds-gray/gray-200', darkAlias: '@-mds-gray/gray-200' },
  { name: 'Stroke-Field-Border-Default', lightAlias: '@-mds-gray/gray-400', darkAlias: '@-mds-gray/gray-400' },
  { name: 'Stroke-Active', lightAlias: '@-mds-blue/blue-900', darkAlias: '@-mds-blue/blue-900' },
  { name: 'Stroke-Focus', lightAlias: '@-mds-indigo/indigo-700', darkAlias: '@-mds-indigo/indigo-700' },
];

const STATUS_TOKENS: Token[] = [
  { name: 'Color/Red/Default/Dark', lightAlias: '@-mds-red/red-900', darkAlias: '@-mds-red/red-900' },
  { name: 'Color/Red/Default/Medium', lightAlias: '@-mds-red/red-600', darkAlias: '@-mds-red/red-400' },
  { name: 'Color/Red/Default/Subtle', lightAlias: '@-mds-red/red-200', darkAlias: '@-mds-red/red-200' },
  { name: 'Color/Green/Default/Dark', lightAlias: '@-mds-green/green-900', darkAlias: '@-mds-green/green-900' },
  { name: 'Color/Green/Default/Medium', lightAlias: '@-mds-green/green-400', darkAlias: '@-mds-green/green-400' },
  { name: 'Color/Green/Default/Subtle', lightAlias: '@-mds-green/green-100', darkAlias: '@-mds-green/green-100' },
  { name: 'Color/Blue/Default/Dark', lightAlias: '@-mds-blue/blue-1000', darkAlias: '@-mds-blue/blue-1000' },
  { name: 'Color/Blue/Default/Medium', lightAlias: '@-mds-blue/blue-500', darkAlias: '@-mds-blue/blue-500' },
  { name: 'Color/Blue/Default/Subtle', lightAlias: '@-mds-blue/blue-100', darkAlias: '@-mds-blue/blue-100' },
];

function isLight(hex: string) {
  if (!hex.startsWith('#')) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

function TokenRow({ token, mode }: { token: Token; mode: 'light' | 'dark' }) {
  const alias = mode === 'light' ? token.lightAlias : token.darkAlias;
  const hex = alias.startsWith('@') ? resolve(alias, mode) : alias;
  const textColor = isLight(hex) ? '#000000' : '#ffffff';
  return (
    <div className="flex items-center gap-4 border-b border-[#eef1f6] py-3 last:border-none">
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-[#eef1f6] shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-[#202124] truncate">{token.name}</p>
        <p className="text-[10px] text-[#858c9b]">{alias.replace('@', '')}</p>
      </div>
      <div
        className="rounded px-2 py-0.5 font-mono text-[10px]"
        style={{ backgroundColor: hex, color: textColor }}
      >
        {hex}
      </div>
    </div>
  );
}

interface SemanticTokensProps {
  mode?: 'light' | 'dark';
}

export function SemanticTokens({ mode = 'light' }: SemanticTokensProps) {
  const sections = [
    { title: 'Surface', tokens: SURFACE_TOKENS },
    { title: 'Text', tokens: TEXT_TOKENS },
    { title: 'Strokes', tokens: STROKE_TOKENS },
    { title: 'Status Colors', tokens: STATUS_TOKENS },
  ];

  return (
    <div className="space-y-8 p-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-[#202124]">MDS Semantic Tokens</h1>
        <p className="mt-1 text-sm text-[#626978]">
          Surface, text, stroke, and status tokens · {mode === 'light' ? 'Light' : 'Dark'} mode
        </p>
      </div>

      {sections.map(({ title, tokens }) => (
        <div key={title}>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#858c9b]">
            {title}
          </h2>
          <div className="rounded-xl border border-[#eef1f6] bg-white px-6">
            {tokens.map((t) => (
              <TokenRow key={t.name} token={t} mode={mode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
