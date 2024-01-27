'use client'

import { Message } from 'ai';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { cn } from '@/libs/utils';
import { MemoizedReactMarkdown } from '@/components/chat/markdown';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from "axios";


function extractUrl(text: string) {
  const urlRegex = /\((https?:\/\/[^\s]+)\)/;
  const match = text.match(urlRegex);
  if (match && match[1]) return match[1];
  return '';
}

export interface ChatMessageProps {
  message: Message;
}
export function ChatMessage({ message, ...props }: ChatMessageProps) {

  return (
    <div
      className={cn(
        'group  relative isolate mb-4 flex w-full flex-col items-start px-8 max-md:px-0',
        message.role === 'user' ? 'items-end' : 'items-start'
      )}
      {...props}
    >
      <div
        className={cn(
          'flex xl:max-w-[50%] w-full',
          message.role === 'user'
            ? 'flex-row-reverse gap-5 max-md:gap-0'
            : 'flex-row gap-8 max-md:gap-0'
        )}
      >
        {/*<div*/}
        {/*  className={cn(*/}
        {/*    'flex shrink-0 select-none items-center justify-center self-end bg-transparent'*/}
        {/*  )}*/}
        {/*>*/}
          {/*{message.role === 'user' ? (*/}
          {/*  <Image*/}
          {/*    width={72}*/}
          {/*    height={72}*/}
          {/*    src="/UserAvatar.png"*/}
          {/*    alt="User Avatar"*/}
          {/*    className="relative z-10"*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  <Image*/}
          {/*    width={120}*/}
          {/*    height={120}*/}
          {/*    src={`/${aigulStickers[currentImgId]}.webp`}*/}
          {/*    alt="Angry Girl"*/}
          {/*    className="relative z-10 max-md:h-[72px] max-md:w-[70px]"*/}
          {/*  />*/}
          {/*)}*/}
        {/*</div>*/}
        <div
          className={cn(
            'relative text-black items-center space-y-2 self-start rounded-xl bg-gradient-to-r px-8 py-4 after:absolute after:bottom-0 after:translate-y-[80%]  max-md:px-4  max-md:py-2',
            message.role === 'user'
              ? 'mb-[50px] rounded-br-none bg-[#d3d3d3]'
              : 'mb-[100px] rounded-bl-none bg-[#d3d3d3]'
          )}
        >
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert  prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return (
                  <p className="mb-2 !font-days text-xl !leading-tight !text-black last:mb-0 max-md:text-lg">
                    {children}
                  </p>
                );
              },
            }}
          >
            {message.content}
          </MemoizedReactMarkdown>
          {/*<ChatMessageActions message={message} />*/}
          {
            extractUrl(message.content) && (
                  <div className={"bg-[#00b3ba] w-fit px-2 py-1 rounded-md text-white"}>
                    <a target={"_blank"} href={extractUrl(message.content)}>Получить</a>
                  </div>
              )

          }
        </div>
      </div>
    </div>
  );
}
