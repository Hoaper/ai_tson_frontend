'use client';

import {useChat, type Message} from 'ai/react';
import {cn} from '@/libs/utils';
import {ChatList} from '@/components/chat/chat-list';
import {ChatPanel} from '@/components/chat/chat-panel';
import {ChatScrollAnchor} from '@/components/chat/chat-scroll-anchor';
import {useLocalStorage} from '@/libs/hooks/use-local-storage';
import {useState} from 'react';
import {toast} from 'react-hot-toast';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({id, initialMessages, className}: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null);
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '');
  const {messages, append, reload, stop, isLoading, input, setInput} = useChat({
    initialMessages,
    id,
    body: {
      id,
      previewToken,
    },
    onResponse(response) {
      if (response.status == 401) {
        toast(response.statusText);
      }
    },
  });
  return (
    <div>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>

        {messages.length || isLoading ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <> {/* <EmptyScreen setInput={setInput} /> */}</>
        )}
      </div>
      <ChatPanel
        id={id}
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
