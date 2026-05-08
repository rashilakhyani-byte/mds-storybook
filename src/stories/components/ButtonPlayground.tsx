import { useState, useMemo } from 'react';
import { ICON_MAP } from '../utils/phosphorIcons';
import { Button, type ButtonVariant, type ButtonSize } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { SplitButton, type SplitButtonVariant } from '../../components/ui/SplitButton';

type Slot = 'leading' | 'trailing';
type Tab  = 'Button' | 'IconButton' | 'SplitButton';

const ICON_SIZE = 12;
const DefaultIcon = ICON_MAP['MagnifyingGlass'];

function renderIcon(name: string | null) {
  if (!name) return undefined;
  const C = ICON_MAP[name];
  return C ? <C size={ICON_SIZE} weight="bold" /> : undefined;
}

// ─── Searchable icon grid ──────────────────────────────────────────────────────
function IconPicker({
  slot,
  selected,
  onSelect,
}: {
  slot: Slot;
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  const [q, setQ] = useState('');

  const icons = useMemo(() => {
    const lq = q.toLowerCase().trim();
    return Object.keys(ICON_MAP).sort().filter((n) => !lq || n.toLowerCase().includes(lq));
  }, [q]);

  return (
    <div className="flex flex-col gap-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#858c9b]">
          {slot === 'leading' ? 'Leading' : 'Trailing'} icon
          {selected && (
            <span className="ml-2 normal-case font-normal text-[#0265dc]">— {selected}</span>
          )}
        </p>
        {selected && (
          <button
            onClick={() => onSelect(null)}
            className="text-[10px] text-[#858c9b] hover:text-[#b40000] underline"
          >
            Remove
          </button>
        )}
      </div>

      {/* search */}
      <div className="relative">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858c9b]" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 1,512 icons…"
          className="h-8 w-full rounded-md border border-[#cdd2dd] bg-white pl-8 pr-3 text-[12px] text-[#202124] placeholder-[#858c9b] outline-none focus:border-[#0265dc] focus:ring-2 focus:ring-[#0265dc]/20"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#858c9b]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* count */}
      <p className="text-[10px] text-[#858c9b]">{icons.length} icons</p>

      {/* grid */}
      <div className="h-56 overflow-y-auto rounded-lg border border-[#eef1f6] bg-[#f7f8f9] p-2">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-1">
          {icons.map((name) => {
            const Icon = ICON_MAP[name];
            const active = selected === name;
            return (
              <button
                key={name}
                onClick={() => onSelect(active ? null : name)}
                title={name}
                className={[
                  'flex flex-col items-center gap-1 rounded-md p-1.5 text-center transition-colors',
                  active
                    ? 'bg-[#0054b6] text-white'
                    : 'hover:bg-white text-[#40444c]',
                ].join(' ')}
              >
                <Icon size={18} weight="regular" />
                <span className={`w-full truncate text-[8px] leading-tight ${active ? 'text-white' : 'text-[#858c9b]'}`}>
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        {icons.length === 0 && (
          <div className="flex h-full items-center justify-center text-[11px] text-[#858c9b]">
            No icons match &ldquo;{q}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main playground ──────────────────────────────────────────────────────────
export function ButtonPlayground() {
  const [tab, setTab]           = useState<Tab>('Button');
  const [variant, setVariant]   = useState<ButtonVariant>('secondary');
  const [splitVar, setSplitVar] = useState<SplitButtonVariant>('secondary');
  const [size, setSize]         = useState<ButtonSize>('md');
  const [label, setLabel]       = useState('Button');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [slot, setSlot]         = useState<Slot>('leading');
  const [leading, setLeading]   = useState<string | null>(null);
  const [trailing, setTrailing] = useState<string | null>(null);

  const TABS: Tab[] = ['Button', 'IconButton', 'SplitButton'];
  const VARIANTS: ButtonVariant[]      = ['primary', 'secondary', 'danger', 'invisible'];
  const SPLIT_VARIANTS: SplitButtonVariant[] = ['primary', 'secondary', 'danger', 'invisible'];
  const SIZES: ButtonSize[]            = ['sm', 'md', 'lg'];

  const activeSlotValue   = slot === 'leading' ? leading : trailing;
  const activeSlotSetter  = slot === 'leading' ? setLeading : setTrailing;

  return (
    <div className="flex min-h-screen flex-col gap-0 font-sans">

      {/* ── Preview bar ───────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 border-b border-[#eef1f6] bg-white px-8 py-10">
        <div className="flex items-center gap-3">
          {tab === 'Button' && (
            <Button
              variant={variant}
              size={size}
              disabled={disabled}
              loading={loading}
              leadingIcon={renderIcon(leading)}
              trailingIcon={renderIcon(trailing)}
            >
              {label}
            </Button>
          )}
          {tab === 'IconButton' && (
            <IconButton
              icon={renderIcon(leading) ?? <DefaultIcon size={12} weight="bold" />}
              label={label}
              disabled={disabled}
            />
          )}
          {tab === 'SplitButton' && (
            <SplitButton
              variant={splitVar}
              disabled={disabled}
              leadingIcon={renderIcon(leading)}
            >
              {label}
            </SplitButton>
          )}
        </div>

        {/* code snippet */}
        <div className="rounded-md bg-[#1d212a] px-4 py-2 font-mono text-[11px] text-[#c9ced7]">
          {tab === 'Button' && (
            <>
              <span className="text-[#78bbfa]">{'<Button'}</span>
              {` variant="${variant}" size="${size}"`}
              {leading  && ` leadingIcon={<${leading} />}`}
              {trailing && ` trailingIcon={<${trailing} />}`}
              {disabled && ' disabled'}
              {loading  && ' loading'}
              <span className="text-[#78bbfa]">{'>'}</span>
              {label}
              <span className="text-[#78bbfa]">{'</Button>'}</span>
            </>
          )}
          {tab === 'IconButton' && (
            <>
              <span className="text-[#78bbfa]">{'<IconButton'}</span>
              {` icon={<${leading ?? 'MagnifyingGlass'} />}`}
              {` label="${label}"`}
              {disabled && ' disabled'}
              <span className="text-[#78bbfa]">{' />'}</span>
            </>
          )}
          {tab === 'SplitButton' && (
            <>
              <span className="text-[#78bbfa]">{'<SplitButton'}</span>
              {` variant="${splitVar}"`}
              {leading && ` leadingIcon={<${leading} />}`}
              {disabled && ' disabled'}
              <span className="text-[#78bbfa]">{'>'}</span>
              {label}
              <span className="text-[#78bbfa]">{'</SplitButton>'}</span>
            </>
          )}
        </div>
      </div>

      {/* ── Config panel ─────────────────────────────────────────────── */}
      <div className="flex flex-1 gap-0 bg-[#f7f8f9]">

        {/* Left sidebar — props */}
        <div className="flex w-56 shrink-0 flex-col gap-5 border-r border-[#eef1f6] bg-white p-5">

          {/* Component tab */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Component</label>
            <div className="flex rounded-md border border-[#eef1f6] overflow-hidden">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-1 text-[10px] font-medium transition-colors ${tab === t ? 'bg-[#0054b6] text-white' : 'text-[#626978] hover:bg-[#f7f8f9]'}`}>
                  {t.replace('Button', '').trim() || 'Simple'}
                </button>
              ))}
            </div>
          </div>

          {/* Variant */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Variant</label>
            <div className="flex flex-col gap-1">
              {(tab === 'SplitButton' ? SPLIT_VARIANTS : VARIANTS).map((v) => (
                <button key={v} onClick={() => tab === 'SplitButton' ? setSplitVar(v as SplitButtonVariant) : setVariant(v as ButtonVariant)}
                  className={`rounded px-2 py-1 text-left text-[11px] capitalize transition-colors ${
                    (tab === 'SplitButton' ? splitVar : variant) === v
                      ? 'bg-[#e0f2ff] text-[#0054b6] font-medium'
                      : 'text-[#626978] hover:bg-[#f7f8f9]'
                  }`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Size (Button only) */}
          {tab === 'Button' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Size</label>
              <div className="flex gap-1">
                {SIZES.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`flex-1 rounded py-1 text-[11px] font-medium uppercase transition-colors ${size === s ? 'bg-[#0054b6] text-white' : 'bg-[#f7f8f9] text-[#626978] hover:bg-[#eef1f6]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Label */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">Label</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)}
              className="h-7 rounded border border-[#cdd2dd] px-2 text-[12px] text-[#202124] outline-none focus:border-[#0265dc]" />
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-2">
            {[
              { key: 'disabled', val: disabled, set: setDisabled },
              ...(tab === 'Button' ? [{ key: 'loading', val: loading, set: setLoading }] : []),
            ].map(({ key, val, set }) => (
              <label key={key} className="flex cursor-pointer items-center gap-2">
                <div onClick={() => (set as (v: boolean) => void)(!val)}
                  className={`h-4 w-7 rounded-full transition-colors ${val ? 'bg-[#0054b6]' : 'bg-[#cdd2dd]'} relative`}>
                  <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-3' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-[11px] capitalize text-[#626978]">{key}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right — icon picker */}
        <div className="flex flex-1 flex-col gap-4 p-6">

          {/* Slot tabs (Button & SplitButton only) */}
          {tab !== 'IconButton' && (
            <div className="flex gap-2">
              {(['leading', 'trailing'] as Slot[]).map((s) => (
                <button key={s} onClick={() => setSlot(s)}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${slot === s ? 'bg-[#0054b6] text-white' : 'bg-white border border-[#cdd2dd] text-[#626978] hover:bg-[#eef1f6]'}`}>
                  {s} icon
                  {s === 'leading'  && leading  && <span className="ml-1.5 opacity-70">· {leading}</span>}
                  {s === 'trailing' && trailing && <span className="ml-1.5 opacity-70">· {trailing}</span>}
                </button>
              ))}
            </div>
          )}

          <IconPicker
            slot={tab === 'IconButton' ? 'leading' : slot}
            selected={tab === 'IconButton' ? leading : activeSlotValue}
            onSelect={tab === 'IconButton' ? setLeading : activeSlotSetter}
          />
        </div>
      </div>
    </div>
  );
}
