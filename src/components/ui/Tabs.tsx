import { useRef, useState, useEffect, type ReactNode } from 'react';
import { X, CaretLeft, CaretRight, CaretUp, CaretDown } from '@phosphor-icons/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  closable?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  onClose?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'simple' | 'panel';
  className?: string;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export function Tabs({
  items,
  value,
  onChange,
  onClose,
  orientation = 'horizontal',
  variant = 'simple',
  className,
}: TabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (orientation === 'horizontal') {
      setCanScrollPrev(el.scrollLeft > 0);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    } else {
      setCanScrollPrev(el.scrollTop > 0);
      setCanScrollNext(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    }
  }

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect(); };
  }, [items, orientation]);

  function scroll(dir: 'prev' | 'next') {
    const el = scrollRef.current;
    if (!el) return;
    const delta = dir === 'next' ? 80 : -80;
    if (orientation === 'horizontal') el.scrollBy({ left: delta, behavior: 'smooth' });
    else el.scrollBy({ top: delta, behavior: 'smooth' });
  }

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${className ?? ''}`}>
        {/* scroll up */}
        <button
          onClick={() => scroll('prev')}
          disabled={!canScrollPrev}
          className="flex h-[22px] w-full items-center justify-center border-l border-[#eef1f6] text-[#626978] transition-colors hover:bg-[#f7f8f9] disabled:opacity-30"
        >
          <CaretUp size={10} weight="bold" />
        </button>

        {/* scrollable list */}
        <div ref={scrollRef} className="overflow-y-auto scrollbar-none">
          {items.map((item) => (
            <SimpleTabVertical
              key={item.value}
              item={item}
              active={item.value === value}
              onClick={() => !item.disabled && onChange?.(item.value)}
              onClose={onClose}
            />
          ))}
        </div>

        {/* scroll down */}
        <button
          onClick={() => scroll('next')}
          disabled={!canScrollNext}
          className="flex h-[22px] w-full items-center justify-center border-l border-[#eef1f6] text-[#626978] transition-colors hover:bg-[#f7f8f9] disabled:opacity-30"
        >
          <CaretDown size={10} weight="bold" />
        </button>
      </div>
    );
  }

  if (variant === 'panel') {
    return (
      <div className={`flex items-end border-b border-[#cdd2dd] ${className ?? ''}`}>
        {items.map((item) => (
          <PanelTab
            key={item.value}
            item={item}
            active={item.value === value}
            onClick={() => !item.disabled && onChange?.(item.value)}
            onClose={onClose}
          />
        ))}
      </div>
    );
  }

  // Simple horizontal (default)
  return (
    <div className={`flex items-center shadow-[inset_0_-1px_0_#e5e6e8] ${className ?? ''}`}>
      {/* scroll left */}
      <button
        onClick={() => scroll('prev')}
        disabled={!canScrollPrev}
        className="flex h-[32px] shrink-0 items-center justify-center border-r border-[#eef1f6] px-1 text-[#626978] transition-colors hover:bg-[#f7f8f9] disabled:opacity-30"
      >
        <CaretLeft size={10} weight="bold" />
      </button>

      {/* scrollable tabs */}
      <div ref={scrollRef} className="flex min-w-0 flex-1 overflow-x-auto scrollbar-none">
        {items.map((item) => (
          <SimpleTabHorizontal
            key={item.value}
            item={item}
            active={item.value === value}
            onClick={() => !item.disabled && onChange?.(item.value)}
            onClose={onClose}
          />
        ))}
      </div>

      {/* scroll right */}
      <button
        onClick={() => scroll('next')}
        disabled={!canScrollNext}
        className="flex h-[32px] shrink-0 items-center justify-center border-l border-[#eef1f6] px-1 text-[#626978] transition-colors hover:bg-[#f7f8f9] disabled:opacity-30"
      >
        <CaretRight size={10} weight="bold" />
      </button>
    </div>
  );
}

// ─── SimpleTabHorizontal ──────────────────────────────────────────────────────

function SimpleTabHorizontal({
  item, active, onClick, onClose,
}: {
  item: TabItem;
  active: boolean;
  onClick: () => void;
  onClose?: (value: string) => void;
}) {
  return (
    <div
      role="tab"
      aria-selected={active}
      aria-disabled={item.disabled}
      onClick={onClick}
      className={[
        'group relative flex h-[32px] shrink-0 cursor-pointer select-none items-center gap-1 pl-3 pr-[6px]',
        item.disabled
          ? 'cursor-not-allowed opacity-50'
          : active
            ? 'text-black'
            : 'text-[#626978] hover:bg-[#fbfcff] hover:text-[#40444c]',
      ].join(' ')}
    >
      {/* icon */}
      {item.icon && (
        <span className="shrink-0 text-[#626978]">{item.icon}</span>
      )}

      {/* label */}
      <span className="whitespace-nowrap text-[13px] font-medium leading-[16px]">
        {item.label}
      </span>

      {/* close button */}
      {item.closable && onClose && (
        <button
          onClick={(e) => { e.stopPropagation(); onClose(item.value); }}
          className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[#626978] opacity-0 transition-opacity hover:bg-[#eef1f6] hover:text-[#202124] group-hover:opacity-100"
        >
          <X size={10} weight="bold" />
        </button>
      )}

      {/* active indicator — bottom */}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-[2px] bg-[#0265dc]" />
      )}
      {/* disabled indicator */}
      {item.disabled && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-[2px] bg-[#a5adbd]" />
      )}
    </div>
  );
}

// ─── SimpleTabVertical ────────────────────────────────────────────────────────

function SimpleTabVertical({
  item, active, onClick, onClose,
}: {
  item: TabItem;
  active: boolean;
  onClick: () => void;
  onClose?: (value: string) => void;
}) {
  return (
    <div
      role="tab"
      aria-selected={active}
      aria-disabled={item.disabled}
      onClick={onClick}
      className={[
        'group relative flex h-[32px] w-full cursor-pointer select-none items-center gap-1 pl-3 pr-[6px]',
        item.disabled
          ? 'cursor-not-allowed opacity-50'
          : active
            ? 'text-black'
            : 'text-[#626978] hover:bg-[#fbfcff] hover:text-[#40444c]',
      ].join(' ')}
    >
      {item.icon && <span className="shrink-0 text-[#626978]">{item.icon}</span>}

      <span className="whitespace-nowrap text-[13px] font-medium leading-[16px]">
        {item.label}
      </span>

      {item.closable && onClose && (
        <button
          onClick={(e) => { e.stopPropagation(); onClose(item.value); }}
          className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded text-[#626978] opacity-0 transition-opacity hover:bg-[#eef1f6] group-hover:opacity-100"
        >
          <X size={10} weight="bold" />
        </button>
      )}

      {/* active indicator — left bar */}
      {active && (
        <span className="absolute bottom-[2px] left-0 top-0 w-[3px] rounded-[2px] bg-[#0265dc]" />
      )}
      {item.disabled && (
        <span className="absolute bottom-[2px] left-0 top-0 w-[3px] rounded-[2px] bg-[#a5adbd]" />
      )}
    </div>
  );
}

// ─── PanelTab ─────────────────────────────────────────────────────────────────

function PanelTab({
  item, active, onClick, onClose,
}: {
  item: TabItem;
  active: boolean;
  onClick: () => void;
  onClose?: (value: string) => void;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      disabled={item.disabled}
      onClick={onClick}
      className={[
        'group relative flex items-center gap-[6px] rounded-t-[2px] py-[6px] text-[12px] font-medium leading-[16px] transition-colors',
        item.closable ? 'pl-3 pr-[6px]' : 'px-3',
        active
          ? 'border border-b-0 border-[#cdd2dd] bg-white text-[#202124] shadow-[0_1px_0_white]'
          : item.disabled
            ? 'cursor-not-allowed border border-transparent text-[#a5adbd]'
            : 'border border-transparent bg-transparent text-[#626978] hover:bg-[#f7f8f9] hover:text-[#40444c]',
      ].join(' ')}
    >
      {item.icon && <span className="shrink-0">{item.icon}</span>}
      <span className="whitespace-nowrap">{item.label}</span>
      {item.closable && onClose && (
        <span
          role="button"
          onClick={(e) => { e.stopPropagation(); onClose(item.value); }}
          className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[#858c9b] opacity-0 transition-opacity hover:bg-[#eef1f6] group-hover:opacity-100"
        >
          <X size={10} weight="bold" />
        </span>
      )}
    </button>
  );
}
