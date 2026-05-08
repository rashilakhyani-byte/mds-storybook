import { useState, useRef, useEffect, type ReactNode } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownGroup {
  title?: string;
  options: DropdownOption[];
}

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[] | DropdownGroup[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multi?: boolean;
  required?: boolean;
  note?: string;
  disabled?: boolean;
  layout?: 'inline' | 'block';
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isGrouped(opts: DropdownOption[] | DropdownGroup[]): opts is DropdownGroup[] {
  return opts.length > 0 && 'options' in opts[0];
}

function toGroups(opts: DropdownOption[] | DropdownGroup[]): DropdownGroup[] {
  return isGrouped(opts) ? opts : [{ options: opts as DropdownOption[] }];
}

function getLabel(opts: DropdownOption[] | DropdownGroup[], val: string): string {
  const all = toGroups(opts).flatMap((g) => g.options);
  return all.find((o) => o.value === val)?.label ?? val;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Dropdown({
  label,
  placeholder = 'Select…',
  options,
  value,
  onChange,
  multi = false,
  required = false,
  note,
  disabled = false,
  layout = 'inline',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = multi
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' ? value : null);

  // Display text in trigger
  const displayText = multi
    ? (selected as string[]).length === 0
      ? null
      : (selected as string[]).length === 1
        ? getLabel(options, (selected as string[])[0])
        : `${(selected as string[]).length} selected`
    : selected
      ? getLabel(options, selected as string)
      : null;

  function toggle(optVal: string) {
    if (multi) {
      const arr = selected as string[];
      const next = arr.includes(optVal) ? arr.filter((v) => v !== optVal) : [...arr, optVal];
      onChange?.(next);
    } else {
      onChange?.(optVal === selected ? '' : optVal);
      setOpen(false);
    }
  }

  function isSelected(optVal: string) {
    return multi ? (selected as string[]).includes(optVal) : selected === optVal;
  }

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const groups = toGroups(options);

  // ── Trigger field ────────────────────────────────────────────────────────
  const field = (
    <div className="relative flex-1 min-w-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={[
          'flex w-full items-center gap-1 overflow-hidden py-[6px] pl-[6px] pr-1 text-left text-[12px] font-medium leading-[16px] transition-colors',
          open
            ? 'bg-[#f7f8f9] ring-1 ring-inset ring-[#0265dc]'
            : 'bg-[#f7f8f9] hover:bg-[#eef1f6]',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ].join(' ')}
      >
        <span className={`flex-1 truncate ${displayText ? 'text-[#202124]' : 'text-[#858c9b]'}`}>
          {displayText ?? placeholder}
        </span>
        <CaretDown
          size={16}
          weight="regular"
          className={`shrink-0 text-[#626978] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+2px)] z-50 min-w-full w-max max-w-[335px] rounded-[4px] border border-[#cdd2dd] bg-white p-1 shadow-[0px_3px_4px_rgba(9,30,66,0.08),0px_0px_0.5px_rgba(9,30,66,0.27)]">
          {groups.map((group, gi) => (
            <div key={gi}>
              {/* Section divider between groups */}
              {gi > 0 && <div className="my-1 border-t border-[#eef1f6]" />}

              {/* Optional section title */}
              {group.title && (
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#858c9b]">
                  {group.title}
                </p>
              )}

              {group.options.map((opt) => {
                const sel = isSelected(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => !opt.disabled && toggle(opt.value)}
                    className={[
                      'flex w-full items-center gap-2 rounded-[3px] px-2 py-[6px] text-left text-[13px] font-medium leading-[16px] transition-colors',
                      opt.disabled
                        ? 'cursor-not-allowed text-[#858c9b]'
                        : opt.destructive
                          ? 'cursor-pointer text-[#b40000] hover:bg-[#fff0f0]'
                          : sel
                            ? 'cursor-pointer bg-[#e0f2ff] text-[#0054b6]'
                            : 'cursor-pointer text-[#202124] hover:bg-[#f7f8f9]',
                    ].join(' ')}
                  >
                    {/* Leading: checkbox (multi) or icon (single) */}
                    {multi ? (
                      <span
                        className={[
                          'flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border',
                          sel
                            ? 'border-[#0265dc] bg-[#0265dc]'
                            : 'border-[#a5adbd] bg-white',
                        ].join(' ')}
                      >
                        {sel && (
                          <Check size={8} weight="bold" className="text-white" />
                        )}
                      </span>
                    ) : opt.icon ? (
                      <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center text-[#626978]">
                        {opt.icon}
                      </span>
                    ) : null}

                    {/* Label + description */}
                    <span className="flex flex-1 min-w-0 flex-col gap-px">
                      <span className="truncate">{opt.label}</span>
                      {opt.description && (
                        <span className="truncate text-[11px] font-normal text-[#858c9b]">
                          {opt.description}
                        </span>
                      )}
                    </span>

                    {/* Trailing check (single-select) */}
                    {!multi && sel && (
                      <Check size={14} weight="bold" className="shrink-0 text-[#0265dc]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {note && (
        <p className="mt-1 text-[10px] font-medium text-[#858c9b]">{note}</p>
      )}
    </div>
  );

  // ── Layout ───────────────────────────────────────────────────────────────
  if (layout === 'block') {
    return (
      <div ref={ref} className={`flex flex-col gap-1 ${className ?? ''}`}>
        {label && (
          <div className="flex items-center gap-px">
            <span className="text-[13px] font-bold leading-[16px] text-[#202124]">{label}</span>
            {required && <span className="text-[#ea3829]">*</span>}
          </div>
        )}
        {field}
      </div>
    );
  }

  // inline (default): label left, field right
  return (
    <div ref={ref} className={`flex items-start gap-[6px] border-b border-[#eef1f6] pb-1 ${className ?? ''}`}>
      {label && (
        <div className="flex shrink-0 items-start gap-px pt-[6px] w-[80px]">
          <span className="text-[13px] font-bold leading-[16px] text-[#202124]">{label}</span>
          {required && <span className="text-[#ea3829]">*</span>}
        </div>
      )}
      {field}
    </div>
  );
}
