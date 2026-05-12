import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'invisible';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const base =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-1 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-surface-action text-white hover:bg-surface-action-hover active:bg-surface-action-active disabled:bg-surface-l2 disabled:text-text-disabled',
  secondary:
    'bg-surface-ground text-text-default border border-stroke-section hover:bg-surface-hover active:bg-surface-hover disabled:bg-surface-l2 disabled:text-text-disabled disabled:border-stroke-subsection',
  danger:
    'bg-surface-ground text-red-danger border border-stroke-subsection hover:bg-red-danger hover:text-white hover:border-transparent active:bg-red-danger-active active:text-white active:border-transparent disabled:bg-surface-l2 disabled:text-text-disabled disabled:border-stroke-subsection',
  invisible:
    'bg-transparent text-text-default hover:bg-surface-hover active:bg-surface-hover disabled:text-text-disabled',
};

const sizes: Record<ButtonSize, { container: string; gap: string }> = {
  sm: { container: 'h-[23px] px-2 py-1 text-[12px]', gap: 'gap-1' },
  md: { container: 'h-[27px] px-3 py-1.5 text-[12px]', gap: 'gap-2' },
  lg: { container: 'h-[35px] px-4 py-2.5 text-[12px]', gap: 'gap-2' },
};

const Spinner = () => (
  <svg className="h-3 w-3 animate-spin" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      leadingIcon,
      trailingIcon,
      fullWidth = false,
      loading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    const { container, gap } = sizes[size];
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          base,
          variants[variant],
          container,
          gap,
          fullWidth ? 'w-full justify-start' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? <Spinner /> : leadingIcon && <span className="shrink-0 flex items-center">{leadingIcon}</span>}
        {children && <span>{children}</span>}
        {!loading && trailingIcon && <span className="shrink-0 flex items-center">{trailingIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
