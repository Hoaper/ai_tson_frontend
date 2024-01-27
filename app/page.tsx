'use client';
import {RecordContainer} from '@/components/RecordContainer';
import { Chat } from '@/components/chat/chat';
import {Header} from '@/components/header/Header';
import { BrainIcon } from '@/components/icons/Brain.icon';
import { cn } from '@/libs/utils';
import { useState } from 'react';

export default function Home() {
    const [isModal, setIsModal] = useState(true)
    const [isOpenModal, setIsOpenModal] = useState(false)
  return (
      <>
          <iframe src="https://egov.kz" className={"absolute z-50 w-full h-full"}></iframe>
          <div className={cn(isModal ? ' flex flex-col rounded-xl overflow-hidden fixed z-[99] bg-white top-[min(270px,20vh)] @container/main right-[25px] w-[480px] max-h-[700px] h-[700px] min-h-[600px]' : "min-h-screen container bg-white flex flex-col", isModal && isOpenModal ? '':'opacity-0')}>
              <Header isModal={isModal}/>
              <main className={cn( "flex flex-row grow", isModal && 'relative')}>
                  <Chat isModal={isModal}/>
              </main>
              
          </div>
          <button onClick={() => setIsOpenModal(prev => !prev)} className='bg-[#00B3BA] flex items-center justify-center rounded-full h-[50px] w-[50px] fixed z-[999] right-[35px] top-[calc(min(270px,20vh)+8px)] '><BrainIcon /></button>
      </>
  );
}
