import {type UseChatHelpers} from 'ai/react';

import {ButtonScrollToBottom} from './button-scroll-to-bottom';
import {useEffect, useState} from 'react';
import {PromptForm} from './prompt-form';
import axios from "axios";

export interface ChatPanelProps
  extends Pick<UseChatHelpers, 'append' | 'isLoading' | 'reload' | 'messages' | 'stop' | 'input' | 'setInput'> {
  id?: string;
}

const generateSpeech = async (text: string) => {
  try {
    const response = await axios.post(
        "https://api.openai.com/v1/audio/speech",
        {
          model: "tts-1",
          input: text,
          voice: "alloy",
        },
        {
          headers: {
            Authorization: `Bearer ${
                process.env.OPENAI_API_KEY || "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"
            }`,
          },
          responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const audio = new Audio(url);
    await audio.play();
  } catch (error) {
    console.error(error);
  }
};


export function ChatPanel({id, isLoading, stop, append, reload, input, setInput, messages}: ChatPanelProps) {
  useEffect(() => {
    if (!isLoading && messages?.length > 0) {
      generateSpeech(messages[messages.length - 1].content)
      console.log('Finished!!!');
      setLink('');
      const lastAssistantMessage = messages.filter((msg) => msg.role === 'assistant').slice(-1)[0];

      setLinkHandler(lastAssistantMessage.content);

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
      {/*<ButtonScrollToBottom />*/}
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
