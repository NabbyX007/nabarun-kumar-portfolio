import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-control font-medium whitespace-nowrap select-none transition-[background-color,background-position,border-color,color,box-shadow,transform] duration-500 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-3 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] active:duration-150';

const variants: Record<Variant, string> = {
  primary:
    'btn-shine text-white bg-[linear-gradient(110deg,#4a7bff,#7a68ff_35%,#9a7bff_55%,#4a7bff)] bg-[length:200%_100%] bg-[position:0%_50%] hover:bg-[position:100%_50%] shadow-[0_10px_30px_-12px_rgb(91_140_255/0.75),inset_0_1px_0_rgb(255_255_255/0.28),inset_0_-1px_0_rgb(0_0_0/0.2)] hover:shadow-[0_18px_44px_-12px_rgb(122_104_255/0.9),0_0_0_1px_rgb(187_167_255/0.35),inset_0_1px_0_rgb(255_255_255/0.32)]',
  secondary:
    'glass text-fg hover:border-signal/45 hover:bg-ink-700/70 hover:shadow-[0_12px_34px_-16px_rgb(91_140_255/0.55)]',
  ghost: 'text-fg-soft hover:text-fg hover:bg-white/[0.06]',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-12 px-6 text-base',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  children: ReactNode;
}

function Content({ icon, iconPosition = 'end', children }: Pick<CommonProps, 'icon' | 'iconPosition' | 'children'>) {
  return (
    <>
      {icon && iconPosition === 'start' && (
        <span className="shrink-0 transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'end' && (
        <span className="shrink-0 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, CommonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ variant, size, icon, iconPosition, className, children, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  ),
);
Button.displayName = 'Button';

export const ButtonLink = forwardRef<HTMLAnchorElement, CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ variant, size, icon, iconPosition, className, children, ...rest }, ref) => (
    <a ref={ref} className={buttonClasses(variant, size, className)} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </a>
  ),
);
ButtonLink.displayName = 'ButtonLink';
