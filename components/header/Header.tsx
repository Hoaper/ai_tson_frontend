'use client';

import { EgovLogo } from '../icons/EgovLogo.icon';
import { LanguageToggle } from './LanguageToggle';

const Header = () => {

  return (
    <header className="pt-10 pb-7 border-b border-[rgba(55,55,55,0.12)]">
      <div className="flex w-full justify-between items-center">
        <EgovLogo />

        <div>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export { Header };

