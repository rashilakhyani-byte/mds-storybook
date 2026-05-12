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
    'bg-surface-ground text-text-default border-y border-l border-stroke-section hover:bg-surface-hover active:bg-surface-hover rounded-l-md disabled:bg-surface-l2 disabled:text-text-disabled',
  primary:
    'bg-surface-action text-white border-y border-l border-surface-action hover:bg-surface-action-hover active:bg-surface-action-active rounded-l-md disabled:bg-surface-l2 disabled:text-text-disabled',
  danger:
    'bg-surface-ground text-red-danger border-y border-l border-stroke-subsection hover:bg-red-danger hover:text-white active:bg-red-danger-active active:text-white rounded-l-md disabled:bg-surface-l2 disabled:text-text-disabled',
  invisible:
    'bg-transparent text-text-default border-y border-l border-transparent hover:bg-surface-hover active:bg-surface-hover rounded-l-md disabled:text-text-disabled',
};

const dropdownVariants: Record<SplitButtonVariant, string> = {
  secondary:
    'bg-surface-ground text-text-default border border-stroke-section hover:bg-surface-hover active:bg-surface-hover rounded-r-md border-l-stroke-subsection disabled:bg-surface-l2 disabled:text-text-disabled',
  primary:
    'bg-surface-action text-white border border-surface-action hover:bg-surface-action-hover active:bg-surface-action-active rounded-r-md border-l-white/20 disabled:bg-surface-l2 disabled:text-text-disabled',
  danger:
    'bg-surface-ground text-red-danger border border-stroke-subsection hover:bg-red-danger hover:text-white active:bg-red-danger-active active:text-white rounded-r-md border-l-stroke-subsection disabled:bg-surface-l2 disabled:text-text-disabled',
  invisible:
    'bg-transparent text-text-default border border-transparent hover:bg-surface-hover active:bg-surface-hover rounded-r-md disabled:text-text-disabled',
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
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-1',
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
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-1',
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
