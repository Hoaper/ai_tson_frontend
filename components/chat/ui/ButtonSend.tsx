import {cn} from '@/libs/utils';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const ButtonSend: React.FC<ButtonProps> = ({className, ...props}) => {
  return (
    <button className={cn('w-12 h-12 relative rounded-[10px] bg-[#00B3BA] disabled:opacity-30', className)} {...props}>
      <svg
        width="22"
        height="18"
        fill="none"
        viewBox="0 0 22 18"
        className="absolute left-1/2 top-1/2 -translate-x-[40%] -translate-y-1/2">
        <path
          fill="#fff"
          d="M0 0c2.383.967 4.754 1.966 7.132 2.947 4.713 1.957 9.428 3.907 14.139 5.868-4.987 2.075-9.978 4.14-14.967 6.211-2.102.867-4.197 1.75-6.304 2.604.518-2.223.983-4.458 1.474-6.688.15-.71.318-1.416.456-2.127-.289-1.406-.608-2.807-.909-4.21C.686 3.067.36 1.53.001 0Zm2.27 2.74c.38 1.749.765 3.497 1.146 5.247 3.842-.003 7.685.01 11.527-.007-.079-.03-.157-.06-.236-.092C10.561 6.173 6.417 4.454 2.27 2.74Zm1.145 6.904c-.38 1.75-.765 3.497-1.145 5.247 4.226-1.747 8.449-3.502 12.676-5.247-3.844-.004-7.687-.002-11.531 0Z"
        />
      </svg>
    </button>
  );
};
