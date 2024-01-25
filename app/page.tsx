'use client';
import {RecordContainer} from '@/components/RecordContainer';
import { Chat } from '@/components/chat/chat';
import {Header} from '@/components/header/Header';
import {faMicrophone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect, useRef, useState} from 'react';

export default function Home() {
  return (
    <div className="min-h-screen container bg-white flex flex-col">
      <Header />
      <main className="flex flex-row grow">
        <RecordContainer />

        <Chat id={'12'}  />
      </main>
    </div>
  );
}
