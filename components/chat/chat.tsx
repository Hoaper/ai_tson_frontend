'use client';

import {useChat, type Message} from 'ai/react';
import {cn} from '@/libs/utils';
import {ChatList} from '@/components/chat/chat-list';
import {ChatPanel} from '@/components/chat/chat-panel';
import {ChatScrollAnchor} from '@/components/chat/chat-scroll-anchor';
import {useLocalStorage} from '@/libs/hooks/use-local-storage';
import {toast} from 'react-hot-toast';
import {RecordContainer} from "@/components/RecordContainer";

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ initialMessages, className}: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null);
  const {messages, append, reload, stop, isLoading, input, setInput} = useChat({
    initialMessages,
    onResponse(response) {
      if (response.status == 401) {
        toast(response.statusText);
      }
    },
  });
  return (
    <div className={'w-full'}>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>

        {messages.length || isLoading ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
            <RecordContainer setInput={setInput} isChatMicro={false} />
        )}
      </div>
      <ChatPanel
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}
