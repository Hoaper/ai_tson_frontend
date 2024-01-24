'use client';
import Lottie from 'react-lottie';
import thinking_animation from '@/animations/animation_thinking.json';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMicrophone} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useRef, useState} from 'react';

export default function Home() {
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
          'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`
        }
      })
  
      console.log('@response', response);
    } catch (error) {
      console.log('@sendAudio error', error);
    }
  };

  // let recorder: MediaRecorder | null = null;
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
          sendAudio(AUDIO_BLOB)
          AUDIO.current?.setAttribute('src', window.URL.createObjectURL(AUDIO_BLOB));
        }
        // reset
        setRecorderState(null);
        setIsRecording(false);
      };
    }

    return () => {
      if (recorder) recorder.stream.getAudioTracks().forEach((track) => track.stop());
    };
  }, [recorderState]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#1CA42B] to-[#186895] p-24">
      <div className={'flex flex-row gap-10 -mt-20'}>
        <div className={'flex items-center justify-center rounded-full bg-black/20 w-[110px] h-[110px]'}>
          <button onClick={() => handleRecord()} className="cursor-pointer">
            <FontAwesomeIcon className={'text-black w-[70px] h-[70px]'} icon={faMicrophone} />
            {isRecording ? 'Stop' : 'Start'}
          </button>
        </div>
        <audio ref={AUDIO} controls />
      </div>
    </main>
  );
}


