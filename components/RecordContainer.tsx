import {cn} from '@/libs/utils';
import {useEffect, useRef, useState} from 'react';
import {Spinner} from './icons/Spinner.svg';
import toast from 'react-hot-toast';

export const RecordContainer = ({setInput}: {setInput: (string: string) => void}) => {
  const AUDIO = useRef<HTMLAudioElement>(null);
  const [recorderState, setRecorderState] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const sendAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('model', 'whisper-1');
      formData.append('file', audioBlob, 'hey.mp3');
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API_KEY}`,
        },
      });

      if(response.ok) {
        const text: {text: string} = await response.json()
        console.log('@response', text.text);
        // toast.success(text.text, {duration: 5000})
        setInput(text.text)
      }

    } catch (error) {
      toast.error(`This didn't work. ${error}`)
      console.log('@sendAudio error', error);
    }
  };


  const handleRecord = () => {
    const startRecording = async () => {
      if (!recorderState) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({audio: true});

          // record Start
          setRecorderState(new MediaRecorder(stream));
          setIsRecording(true);
        } catch (err) {
          console.log(err);
        }
      } else if (recorderState.state !== 'inactive') {
        // record stop
        recorderState.stop();
      }
    };
    startRecording();
  };

  useEffect(() => {
    const recorder = recorderState;
    let chunks: Blob[] = [];

    if (recorder && recorder.state === 'inactive') {
      recorder.start();

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const AUDIO_BLOB = new Blob(chunks, {type: 'audio/mp3'});
        chunks = [];

        if (recorderState) {
          //TODO: with audio
          sendAudio(AUDIO_BLOB);
          AUDIO.current?.setAttribute('src', window.URL.createObjectURL(AUDIO_BLOB));
        }
        // reset
        setRecorderState(null);
        setIsRecording(false);
      };
    }

    return () => {
      if (recorder) {
        recorder.stream.getAudioTracks().forEach((track) => track.stop());
        console.log('@Снести все записи MediaStream');
      }
    };
  }, [recorderState]);

  return (
    <div className={cn("flex flex-col items-center transition-all grow h-full duration-700  relative", isRecording ? ' translate-y-[10%]': 'translate-y-1/2 ')}>
      <button
        onClick={() => handleRecord()}
        className={cn(
          ' before:rounded-full before:bg-[#00B3BA] relative transition-all before:duration-500 w-[232px] h-[232px] before:absolute before:w-[232px] before:h-[232px] before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:transition-all before:ease-in-out',
          isRecording ? 'before:scale-0' : ''
        )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="63"
          height="87"
          fill="none"
          viewBox="0 0 63 87"
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 transition-all',
            isRecording ? 'fill-[#00B3BA] ' : 'fill-white'
          )}>
          <path
            stroke-width="4"
            d="M29.204 73.134v-1.757l-1.743-.226C13.008 69.28 2 57.543 2 43.5v-6.797c0-1.059.92-2.078 2.295-2.078s2.296 1.02 2.296 2.078V43.5c0 13.215 11.25 23.75 24.909 23.75 13.66 0 24.91-10.535 24.91-23.75v-6.797c0-1.059.92-2.078 2.295-2.078S61 35.645 61 36.703V43.5c0 14.043-11.008 25.78-25.461 27.65l-1.744.227v9.467h10.591c1.375 0 2.296 1.02 2.296 2.078 0 1.059-.92 2.078-2.296 2.078H18.614c-1.375 0-2.296-1.02-2.296-2.078 0-1.059.92-2.078 2.296-2.078h10.59v-7.71ZM16.319 16.312C16.318 8.508 23.02 2 31.5 2s15.182 6.508 15.182 14.313V43.5c0 7.805-6.702 14.313-15.182 14.313S16.318 51.304 16.318 43.5V16.312Z"
          />
        </svg>
        {isRecording && (
          <Spinner className="w-[232px] h-[232px] absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2" />
        )}
      </button>
      <audio ref={AUDIO} controls className="hidden fixed left-2 top-2" />
      <p className={cn("text-[rgba(55,55,55,0.50)] font-helvetica text-2xl max-w-[400px] text-center mt-9 transition-opacity", isRecording && 'opacity-0') }>
        Нажмите на микрофон и скажите какая услуга Вас интересует
      </p>
    </div>
  );
};
