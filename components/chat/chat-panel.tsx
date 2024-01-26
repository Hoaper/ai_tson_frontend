import {type UseChatHelpers} from 'ai/react';

import {ButtonScrollToBottom} from './button-scroll-to-bottom';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import {useEffect, useState} from 'react';
import {PromptForm} from './prompt-form';

export interface ChatPanelProps
  extends Pick<UseChatHelpers, 'append' | 'isLoading' | 'reload' | 'messages' | 'stop' | 'input' | 'setInput'> {
  id?: string;
}

export function ChatPanel({id, isLoading, stop, append, reload, input, setInput, messages}: ChatPanelProps) {
  useEffect(() => {
    if (!isLoading && messages?.length > 0) {
      console.log('Finished!!!');
      setLink('');
      const lastAssistantMessage = messages.filter((msg) => msg.role === 'assistant').slice(-1)[0];

      setLinkHandler(lastAssistantMessage.content);

      // Text-to-speech part
      // const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content);
      // utterance.lang = 'ru-RU'; // Set the language code for Russian

      // speechSynthesis.speak(utterance);
    }
  }, [isLoading, messages]);

  const [link, setLink] = useState('');
  const setLinkHandler = (text: string) => {
    const urlRegex = /\((https?:\/\/[^\s]+)\)/;
    const match = text.match(urlRegex);
    if (match && match[1] && match[1].includes('services')) setLink(match[1]);
  };
  return (
    <div className="text-md fixed inset-x-0 bottom-0 from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="container sm:px-4">
     
        <div className="space-y-4 px-2 py-2 max-md:px-2">
   
          <PromptForm
            onSubmit={async (value) => {
              await append({
                content: value,
                role: 'user',
              });
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
