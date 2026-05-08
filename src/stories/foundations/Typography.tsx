interface TextStyle {
  name: string;
  fontFamily: string;
  fontStyle: string;
  fontSize: number;
  lineHeight: string;
  letterSpacing: string;
  textDecoration?: string;
  textCase?: string;
  sample: string;
}

const weightMap: Record<string, string> = {
  'Regular': '400',
  'Medium': '500',
  'Semi Bold': '600',
  'Bold': '700',
};

const STYLES: { group: string; items: TextStyle[] }[] = [
  {
    group: 'Interface / Titles',
    items: [
      { name: 'XXL-Heavy', fontFamily: 'Inter', fontStyle: 'Semi Bold', fontSize: 24, lineHeight: '32px', letterSpacing: '0', sample: 'Page Heading' },
      { name: 'XXL-Normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 24, lineHeight: '32px', letterSpacing: '0', sample: 'Page Heading' },
      { name: 'XL-Heavy', fontFamily: 'Inter', fontStyle: 'Semi Bold', fontSize: 18, lineHeight: '24px', letterSpacing: '0', sample: 'Section Title' },
      { name: 'XL-Normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 18, lineHeight: '24px', letterSpacing: '0', sample: 'Section Title' },
      { name: 'L-Heavy', fontFamily: 'Inter', fontStyle: 'Semi Bold', fontSize: 16, lineHeight: '20px', letterSpacing: '0', sample: 'Card Title' },
      { name: 'L-Normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 16, lineHeight: '20px', letterSpacing: '0', sample: 'Card Title' },
      { name: 'Caption', fontFamily: 'Inter', fontStyle: 'Bold', fontSize: 10, lineHeight: '16px', letterSpacing: '2%', textCase: 'uppercase', sample: 'SECTION LABEL' },
    ],
  },
  {
    group: 'Interface / Body',
    items: [
      { name: 'M-Heavy', fontFamily: 'Inter', fontStyle: 'Semi Bold', fontSize: 13, lineHeight: '16px', letterSpacing: '0', sample: 'Emphasized body text' },
      { name: 'M-Normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 13, lineHeight: '16px', letterSpacing: '0', sample: 'Default body text' },
      { name: 'M-Underlined', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 13, lineHeight: '16px', letterSpacing: '0', textDecoration: 'underline', sample: 'Linked body text' },
      { name: 'Body Caption-Heavy', fontFamily: 'Inter', fontStyle: 'Bold', fontSize: 13, lineHeight: '16px', letterSpacing: '2%', textCase: 'uppercase', sample: 'CAPTION LABEL' },
      { name: 'S-Heavy', fontFamily: 'Inter', fontStyle: 'Semi Bold', fontSize: 12, lineHeight: '16px', letterSpacing: '0', sample: 'Small emphasized text' },
      { name: 'S-Normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 12, lineHeight: '16px', letterSpacing: '0', sample: 'Small body text' },
      { name: 'S-Light', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 12, lineHeight: '16px', letterSpacing: '0', sample: 'Light small text' },
      { name: 'S-Underlined', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 12, lineHeight: '16px', letterSpacing: '0', textDecoration: 'underline', sample: 'Linked small text' },
    ],
  },
  {
    group: 'Interface / Labels',
    items: [
      { name: 'xs-normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 11, lineHeight: '16px', letterSpacing: '0', sample: 'Helper label' },
      { name: 'xs-light', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 11, lineHeight: '16px', letterSpacing: '0', sample: 'Helper label' },
      { name: 'xxs-normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 9, lineHeight: 'auto', letterSpacing: '0', sample: 'Tag label' },
      { name: 'xxs-light', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 9, lineHeight: 'auto', letterSpacing: '0', sample: 'Tag label' },
      { name: 'xxxs-normal', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 8, lineHeight: '12px', letterSpacing: '0', sample: 'Micro label' },
      { name: 'xxxs-light', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 8, lineHeight: '12px', letterSpacing: '0', sample: 'Micro label' },
      { name: 'Button', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 12, lineHeight: 'auto', letterSpacing: '0', sample: 'Button text' },
    ],
  },
  {
    group: 'Content',
    items: [
      { name: 'H1', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 40, lineHeight: '48px', letterSpacing: '0', sample: 'Heading 1' },
      { name: 'H2', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 32, lineHeight: '36px', letterSpacing: '0', sample: 'Heading 2' },
      { name: 'H3', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 24, lineHeight: '36px', letterSpacing: '0', sample: 'Heading 3' },
      { name: 'H4', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 20, lineHeight: '24px', letterSpacing: '0', sample: 'Heading 4' },
      { name: 'H5', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 18, lineHeight: '24px', letterSpacing: '0', sample: 'Heading 5' },
      { name: 'L', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 16, lineHeight: '24px', letterSpacing: '0', sample: 'Large body content' },
      { name: 'M', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 14, lineHeight: '20px', letterSpacing: '0', sample: 'Medium body content' },
      { name: 'M-Heavy', fontFamily: 'Inter', fontStyle: 'Medium', fontSize: 14, lineHeight: 'auto', letterSpacing: '0', sample: 'Medium heavy content' },
      { name: 'M-Bold', fontFamily: 'Inter', fontStyle: 'Semi Bold', fontSize: 14, lineHeight: 'auto', letterSpacing: '0', sample: 'Medium bold content' },
      { name: 'S', fontFamily: 'Inter', fontStyle: 'Regular', fontSize: 12, lineHeight: '16px', letterSpacing: '0', sample: 'Small body content' },
    ],
  },
  {
    group: 'Code Editor',
    items: [
      { name: 'Default-Heavy', fontFamily: 'Roboto Mono', fontStyle: 'Bold', fontSize: 13, lineHeight: '22px', letterSpacing: '0', sample: 'const value = "bold code"' },
      { name: 'Default', fontFamily: 'Roboto Mono', fontStyle: 'Medium', fontSize: 13, lineHeight: '22px', letterSpacing: '0', sample: 'const value = "code"' },
      { name: 'Small-Heavy', fontFamily: 'Roboto Mono', fontStyle: 'Bold', fontSize: 12, lineHeight: '22px', letterSpacing: '0', sample: 'const x = "bold small"' },
      { name: 'Small', fontFamily: 'Roboto Mono', fontStyle: 'Medium', fontSize: 12, lineHeight: '22px', letterSpacing: '0', sample: 'const x = "small code"' },
    ],
  },
];

function StyleRow({ item }: { item: TextStyle }) {
  const fontWeight = weightMap[item.fontStyle] || '400';
  return (
    <div className="flex items-baseline gap-6 border-b border-[#eef1f6] py-4 last:border-none">
      <div className="w-48 shrink-0">
        <p className="text-[11px] font-medium text-[#626978]">{item.name}</p>
        <p className="mt-0.5 text-[10px] text-[#858c9b]">
          {item.fontFamily} · {item.fontStyle} · {item.fontSize}px / {item.lineHeight}
        </p>
      </div>
      <p
        className="text-[#202124]"
        style={{
          fontFamily: item.fontFamily === 'Roboto Mono' ? '"Roboto Mono", monospace' : '"Inter", sans-serif',
          fontSize: item.fontSize,
          fontWeight,
          lineHeight: item.lineHeight === 'auto' ? 'normal' : item.lineHeight,
          textDecoration: item.textDecoration || 'none',
          textTransform: item.textCase === 'uppercase' ? 'uppercase' : 'none',
          letterSpacing: item.letterSpacing === '2%' ? '0.02em' : '0',
        }}
      >
        {item.sample}
      </p>
    </div>
  );
}

export function Typography() {
  return (
    <div className="space-y-10 p-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-[#202124]">MDS Typography</h1>
        <p className="mt-1 text-sm text-[#626978]">
          36 text styles from the Mystic Design System · Inter + Roboto Mono
        </p>
      </div>

      {STYLES.map(({ group, items }) => (
        <div key={group}>
          <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#858c9b]">
            {group}
          </h2>
          <div className="rounded-xl border border-[#eef1f6] bg-white px-6">
            {items.map((item) => (
              <StyleRow key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
