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
  'inline-flex items-center justify-center font-medium rounded-md transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147af3] focus-visible:ring-offset-1 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0054b6] text-white hover:bg-[#003571] active:bg-[#002754] disabled:bg-[#fbfcff] disabled:text-[#858c9b]',
  secondary:
    'bg-white text-[#202124] border border-[#cdd2dd] hover:bg-[#eef1f6] active:bg-[#eef1f6] disabled:bg-[#fbfcff] disabled:text-[#858c9b] disabled:border-[#eef1f6]',
  danger:
    'bg-white text-[#b40000] border border-[#eef1f6] hover:bg-[#b40000] hover:text-white hover:border-transparent active:bg-[#930000] active:text-white active:border-transparent disabled:bg-[#fbfcff] disabled:text-[#858c9b] disabled:border-[#eef1f6]',
  invisible:
    'bg-transparent text-[#202124] hover:bg-[#eef1f6] active:bg-[#eef1f6] disabled:text-[#858c9b]',
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
