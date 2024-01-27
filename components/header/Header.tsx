'use client';

import { cn } from '@/libs/utils';
import { EgovLogo } from '../icons/EgovLogo.icon';
import { LanguageToggle } from './LanguageToggle';

const Header = ({isModal}: {isModal: boolean}) => {

  return (
    <header className={cn(isModal ? "bg-[#00B3BA] px-4 h-[60px]" :"pt-10 mx-16 pb-7 border-b border-[rgba(55,55,55,0.12)]" )}>
      <div className="flex w-full justify-between items-center">
        <EgovLogo className={cn(isModal ? "fill-white w-[57px]" :"fill-[#00B3BA]" )} />

        <div>
          {!isModal && <LanguageToggle />}
        </div>
      </div>
    </header>
  );
};

export { Header };

