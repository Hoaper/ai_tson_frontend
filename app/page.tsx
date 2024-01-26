'use client';
import {RecordContainer} from '@/components/RecordContainer';
import { Chat } from '@/components/chat/chat';
import {Header} from '@/components/header/Header';

export default function Home() {
  return (
      <>
          {/*<iframe src="https://egov.kz" className={"absolute z-50 w-full h-full"}></iframe>*/}
          <div className="min-h-screen container bg-white flex flex-col">
              <Header/>
              <main className="flex flex-row grow">
                  {/*<RecordContainer />*/}
                  <Chat/>
              </main>
          </div>
      </>
  );
}
