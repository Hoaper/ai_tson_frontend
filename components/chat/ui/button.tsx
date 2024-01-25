import { cn } from '@/libs/utils';
import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({className, children, ...props}, ref) => {
  return (
    <button className={cn(className)} ref={ref} {...props}>
      {children}
    </button>
  );
});
Button.displayName = 'Button'


