import {LanguageType} from '@/types/language.types';
import React, {useState} from 'react';

export const LanguageToggle = () => {
  const [activeLang, setActiveLang] = useState<LanguageType>('ru');

  function handleChangeLang(lang: LanguageType) {
    setActiveLang(lang);
  }

  return (
    <div className="flex">
      <label>
        <input
          type="radio"
          value="kz"
          checked={activeLang === 'kz'}
          onChange={() => handleChangeLang('kz')}
          className="sr-only peer"
        />
        <div className="text-[rgba(55,55,55,0.50)] peer-checked:text-white peer-checked:bg-[#00B3BA] text-2xl !leading-none align-middle px-3 h-10 w-[66px] flex items-center rounded-md cursor-pointer justify-center">
          қаз
        </div>
      </label>
      <label>
        <input
          type="radio"
          value="ru"
          checked={activeLang === 'ru'}
          onChange={() => handleChangeLang('ru')}
          className="sr-only peer"
        />
        <div className="text-[rgba(55,55,55,0.50)] peer-checked:text-white peer-checked:bg-[#00B3BA] text-2xl !leading-none align-middle px-3 h-10 w-[66px] flex items-center rounded-md cursor-pointer justify-center">рус</div>
      </label>
    </div>
  );
};
