import {useEffect, useRef, useState} from 'react';
import toast from 'react-hot-toast';
import gsap from 'gsap';

const getAudioDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(({kind}) => kind === 'audioinput');
};

const CONFIG = {
  fps: 60,
  duration: 0.1,
};

const SQUARE = {
  hue: 182,
  scale: 1,
  size: 150,
  opacity: 1
}

const MIN_DECIBELS = -80
/** 2s */
const SILENCE_DELAY = 2

interface Props {
  squareSize?: number
}

export const useAudioRecords = ({squareSize = 150}: Props) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const audioEl = useRef<HTMLAudioElement>(null);
  const [recorderState, setRecorderState] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext>();

  const SQUARE = {
    hue: 182,
    scale: 1,
    size: squareSize || 150,
    opacity: 1
  }
  let silenceStart = performance.now()
  let report: gsap.TickerCallback

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
        toast.success(text.text, {duration: 5000})
      }
    } catch (error) {
      toast.error(`This didn't work. ${error}`)
      console.log('@sendAudio error', error);
    }
  };

  const handleRecord = () => {
    /** Вкл/Выкл запись микрофона */
    const toggleRecording = async () => {
      if (!recorderState) {
        try {
          const deviceId = await getAudioDevices();
          // Если audio = true будет использоваться устройство по умолчанию
          const audio = deviceId ? {advanced: deviceId} : true;
          const mediaStream = await navigator.mediaDevices.getUserMedia({audio});

          setRecorderState(new MediaRecorder(mediaStream));
          setIsRecording(true);
        } catch (err) {
          console.log(err);
        }
      } else if (recorderState.state !== 'inactive') {
        // record stop
        recorderState.stop();
      }
    };
    toggleRecording();
  };

  useEffect(() => {
    const recorder = recorderState;

    if (recorder && recorder.state === 'inactive') {
      recorder.start();
      ANALYSE(recorder.stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        /** данные доступны после вызова recorder.stop(). */
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const AUDIO_BLOB = new Blob(chunks, {type: 'audio/mp3'});

        if (recorder) {
          sendAudio(AUDIO_BLOB); // Отправка аудио
          audioEl.current?.setAttribute('src', window.URL.createObjectURL(AUDIO_BLOB));
        }
        // reset
        RESET_All()
        console.log('@recorder stopped');
      };
    }

    return () => {
      if (recorder) {
        recorder.stream.getAudioTracks().forEach((track) => track.stop());
        console.log('@Снести все записи MediaStream');
      }
    };
    // Обновление хука только при изменении recorderState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorderState]);

  
  const RESET_All = () => {
    setRecorderState(null);
    setIsRecording(false);
    // Последняя анимация в исходное положение
    gsap.to(SQUARE, {
      duration: CONFIG.duration,
      scale: 1,
      hue : 182,
      onStart: () => {
        console.log('@ start to rest position');
      },
      onComplete: () => {
        audioContext?.close().then(() => console.log('@audioContext Closed'));
        gsap.ticker.remove(report);
        console.log('@RESET_All 2');
      },
    });
  };

/******************** ANALYSE ***********************/
  const ANALYSE = (stream: MediaStream) => {
    const audioCtx = new AudioContext();
    const ANALYSER = audioCtx.createAnalyser();
    const SOURCE = audioCtx.createMediaStreamSource(stream);
    const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount);
    SOURCE.connect(ANALYSER);
    ANALYSER.minDecibels = MIN_DECIBELS;

    report = (time) => {
      if(recorderState?.state === 'recording'){
        ANALYSER.getByteFrequencyData(DATA_ARR);
        const VOLUME = Math.max(...DATA_ARR) / 255; // from 0 to 1
        
        gsap.to(SQUARE, {
          scale: gsap.utils.mapRange(0,1,1,2)(VOLUME),
          hue: gsap.utils.mapRange(0, 1, 182, 0)(VOLUME),
          opacity:  gsap.utils.mapRange(0,1,1,0.1)(VOLUME),
          duration: CONFIG.duration,
        });

        if(VOLUME) {  // если есть данные, превышающие заданный предел децебела
          silenceStart = time
        }

        if(time - silenceStart > SILENCE_DELAY ) {
          recorderState.stop();  // record stop
        }
      }
      drawSquare() // рендер квадрата
    };
    gsap.ticker.add(report);

    setAudioContext(audioCtx);
  }

  /***********************  PART CANVAS ***********************************************/
  const drawSquare  = () => {
    if(!canvasEl.current) return
    const canvas = canvasEl.current
    const ctx = canvas.getContext('2d')
    if(!ctx) throw Error('2d ctx Error')

    const SQUARE_SIZE = SQUARE.scale * SQUARE.size
    const SQUARE_POINT = canvas.width / 2 - SQUARE_SIZE / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height) // Очищаем холст
    ctx.fillStyle = `hsl(${SQUARE.hue}, 100%, 36%)`
    ctx.globalAlpha = SQUARE.opacity;
    ctx.beginPath();
    ctx.roundRect(SQUARE_POINT, SQUARE_POINT, SQUARE_SIZE, SQUARE_SIZE, [200])
    ctx.fill();
  }

  useEffect(() => {
    drawSquare()
  }, [canvasEl])


  return {
    handleRecord,
    canvasEl,
    audioEl,
    isRecording
}
}
