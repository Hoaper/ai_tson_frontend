import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import {UseChatHelpers} from 'ai/react';
import 'regenerator-runtime';
import {useEnterSubmit} from '@/libs/hooks/use-enter-submit';
import {cn} from '@/libs/utils';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {MouseEventHandler, useState} from 'react';
import Image from 'next/image';

export interface PromptProps extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
}

export function PromptForm({onSubmit, input, setInput, isLoading}: PromptProps) {
  const {formRef, onKeyDown} = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      setInput(transcript);
      // resetTranscript()
    }
  }, [transcript, setInput]);

  const [listeningState, setListeningState] = useState(false);
  const startListening = () => {
    if (!listeningState) {
      SpeechRecognition.startListening({language: 'en'});
    } else {
      SpeechRecognition.stopListening();
    }
    setListeningState(!listeningState);
  };

  return (
    <>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input?.trim()) {
              return;
            }
            setInput('');
            await onSubmit(input);
          }}
          className="flex flex-row items-center gap-5"
          ref={formRef}>
          <div className="relative z-20 flex max-h-60 w-full grow flex-col overflow-hidden rounded-2xl bg-[rgba(35,0,0,0.6)] px-8 ring-2 ring-red-500 backdrop-blur-sm sm:rounded-2xl sm:border sm:px-12">
            {browserSupportsSpeechRecognition && (
              <div
                onClick={startListening}
                className={cn(
                
                  'absolute left-0 top-4 h-8 w-8 cursor-pointer rounded-full p-0 max-md:ml-2 sm:left-4'
                )}>
                {!listening ? (
                  <>
                    <span>Микрофон иконки</span>
                    <span className="sr-only">Use microphone</span>
                  </>
                ) : (
                  // loading spinner animation below
                  <svg
                    className="h-5 w-5 animate-spin text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 36 36">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                )}
              </div>
            )}

            <Textarea
              ref={inputRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // Ask a question
              placeholder="Take a question..."
              spellCheck={false}
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] font-days focus-within:outline-none max-md:py-2  max-md:text-base sm:text-lg"
            />
          </div>
          <div className="relative">
            <button
              type="submit"
              disabled={isLoading || input === ''}
              className="max-md:h-[50px] max-md:w-[50px] max-md:border-b-2">
              <span className="max-md:hidden"> ENTER</span>
              <span className="md:hidden">
                Иконка отправить
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}