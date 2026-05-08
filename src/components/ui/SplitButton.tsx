import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type SplitButtonVariant = 'secondary' | 'primary' | 'danger' | 'invisible';

export interface SplitButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: SplitButtonVariant;
  leadingIcon?: ReactNode;
  onActionClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  onDropdownClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  children: ReactNode;
}

const actionVariants: Record<SplitButtonVariant, string> = {
  secondary:
    'bg-white text-[#202124] border-y border-l border-[#cdd2dd] hover:bg-[#eef1f6] active:bg-[#eef1f6] rounded-l-md disabled:bg-[#fbfcff] disabled:text-[#858c9b]',
  primary:
    'bg-[#0054b6] text-white border-y border-l border-[#0054b6] hover:bg-[#003571] active:bg-[#002754] rounded-l-md disabled:bg-[#fbfcff] disabled:text-[#858c9b]',
  danger:
    'bg-white text-[#b40000] border-y border-l border-[#eef1f6] hover:bg-[#b40000] hover:text-white active:bg-[#930000] active:text-white rounded-l-md disabled:bg-[#fbfcff] disabled:text-[#858c9b]',
  invisible:
    'bg-transparent text-[#202124] border-y border-l border-transparent hover:bg-[#eef1f6] active:bg-[#eef1f6] rounded-l-md disabled:text-[#858c9b]',
};

const dropdownVariants: Record<SplitButtonVariant, string> = {
  secondary:
    'bg-white text-[#202124] border border-[#cdd2dd] hover:bg-[#eef1f6] active:bg-[#eef1f6] rounded-r-md border-l-[#eef1f6] disabled:bg-[#fbfcff] disabled:text-[#858c9b]',
  primary:
    'bg-[#0054b6] text-white border border-[#0054b6] hover:bg-[#003571] active:bg-[#002754] rounded-r-md border-l-white/20 disabled:bg-[#fbfcff] disabled:text-[#858c9b]',
  danger:
    'bg-white text-[#b40000] border border-[#eef1f6] hover:bg-[#b40000] hover:text-white active:bg-[#930000] active:text-white rounded-r-md border-l-[#eef1f6] disabled:bg-[#fbfcff] disabled:text-[#858c9b]',
  invisible:
    'bg-transparent text-[#202124] border border-transparent hover:bg-[#eef1f6] active:bg-[#eef1f6] rounded-r-md disabled:text-[#858c9b]',
};

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      variant = 'secondary',
      leadingIcon,
      onActionClick,
      onDropdownClick,
      disabled,
      children,
      className = '',
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={`inline-flex ${className}`}>
        <button
          disabled={disabled}
          onClick={onActionClick}
          className={[
            'inline-flex h-[27px] items-center gap-2 px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147af3] focus-visible:ring-offset-1',
            'disabled:pointer-events-none',
            actionVariants[variant],
          ].join(' ')}
        >
          {leadingIcon && <span className="flex items-center">{leadingIcon}</span>}
          <span>{children}</span>
        </button>
        <button
          disabled={disabled}
          onClick={onDropdownClick}
          aria-label="Open dropdown"
          className={[
            'inline-flex h-[27px] w-7 items-center justify-center transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147af3] focus-visible:ring-offset-1',
            'disabled:pointer-events-none',
            dropdownVariants[variant],
          ].join(' ')}
        >
          <ChevronDown />
        </button>
      </div>
    );
  },
);

SplitButton.displayName = 'SplitButton';
