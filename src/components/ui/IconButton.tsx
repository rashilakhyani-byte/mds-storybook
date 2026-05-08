import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'default' | 'active';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  showIndicator?: boolean;
  dropdown?: boolean;
  label: string; // required for a11y
}

const sizes: Record<IconButtonSize, { box: string; iconSize: string }> = {
  sm: { box: 'h-4 w-4', iconSize: 'h-3 w-3' },
  md: { box: 'h-6 w-6', iconSize: 'h-3.5 w-3.5' },
  lg: { box: 'h-7 w-7', iconSize: 'h-4 w-4' },
};

const variants: Record<IconButtonVariant, string> = {
  default:
    'bg-transparent text-[#40444c] border border-[#cdd2dd] hover:bg-[#eef1f6] active:bg-[#eef1f6] disabled:text-[#858c9b] disabled:border-[#eef1f6]',
  active:
    'bg-[#e0f2ff] text-[#0054b6] border border-[#78bbfa] hover:bg-[#cae8ff] active:bg-[#b5deff] disabled:text-[#858c9b] disabled:border-[#eef1f6]',
};

const DropdownCaret = () => (
  <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" className="absolute bottom-0.5 right-0.5 opacity-60">
    <path d="M0 6 L6 0 L6 6 Z" />
  </svg>
);

const Indicator = () => (
  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#0265dc] ring-1 ring-white" />
);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      variant = 'default',
      showIndicator = false,
      dropdown = false,
      label,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    const { box, iconSize } = sizes[size];
    return (
      <button
        ref={ref}
        aria-label={label}
        disabled={disabled}
        className={[
          'relative inline-flex items-center justify-center rounded-md transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147af3] focus-visible:ring-offset-1',
          'disabled:pointer-events-none',
          variants[variant],
          box,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <span className={`flex items-center justify-center ${iconSize}`}>{icon}</span>
        {showIndicator && <Indicator />}
        {dropdown && <DropdownCaret />}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
