import {cn} from '@/libs/utils';
import {Spinner} from './icons/Spinner.svg';
import {useAudioRecords} from '@/libs/hooks/useAudioRecord';

export const RecordContainer = ({isChatMicro}: {isChatMicro: boolean}) => {
  const {handleRecord, isRecording, audioEl, canvasEl} = useAudioRecords({
    squareSize: 40
  });

  return (
    <>
      {isChatMicro ? (
        <div className='absolute right-2 top-1/2 -translate-y-1/2 w-[50px] h-[50px] cursor-pointer rounded-full p-0 max-md:ml-2 '><button
        onClick={() => handleRecord()}
        className={cn(
          ' before:rounded-full before:bg-[#00B3BA] relative transition-all before:duration-500 w-[50px] h-[50px] before:absolute before:w-[50px] before:h-[50px] before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:transition-all before:ease-in-out',
          isRecording ? 'before:scale-0' : 'before:scale-0'
        )}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="63"
          height="87"
          fill="none"
          viewBox="0 0 63 87"
          className={cn(
            'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 transition-all z-10 w-[15px]',
            isRecording ? 'fill-yellow-200 ' : 'fill-[#00B3BA]'
          )}>
          <path
            strokeWidth="4"
            d="M29.204 73.134v-1.757l-1.743-.226C13.008 69.28 2 57.543 2 43.5v-6.797c0-1.059.92-2.078 2.295-2.078s2.296 1.02 2.296 2.078V43.5c0 13.215 11.25 23.75 24.909 23.75 13.66 0 24.91-10.535 24.91-23.75v-6.797c0-1.059.92-2.078 2.295-2.078S61 35.645 61 36.703V43.5c0 14.043-11.008 25.78-25.461 27.65l-1.744.227v9.467h10.591c1.375 0 2.296 1.02 2.296 2.078 0 1.059-.92 2.078-2.296 2.078H18.614c-1.375 0-2.296-1.02-2.296-2.078 0-1.059.92-2.078 2.296-2.078h10.59v-7.71ZM16.319 16.312C16.318 8.508 23.02 2 31.5 2s15.182 6.508 15.182 14.313V43.5c0 7.805-6.702 14.313-15.182 14.313S16.318 51.304 16.318 43.5V16.312Z"
          />
        </svg>
        {isRecording && (
          <canvas
            className="w-[100px] h-[100px] absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2"
            width="100"
            height="100"
            ref={canvasEl}></canvas>
        )}
      </button></div>
      ) : (
        <div
          className={cn(
            'flex flex-col items-center transition-all grow h-full duration-700  relative',
            isRecording ? 'translate-y-[10%]' : 'translate-y-1/2 '
          )}>
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
                'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 transition-all z-10',
                isRecording ? 'fill-yellow-200 ' : 'fill-white'
              )}>
              <path
                strokeWidth="4"
                d="M29.204 73.134v-1.757l-1.743-.226C13.008 69.28 2 57.543 2 43.5v-6.797c0-1.059.92-2.078 2.295-2.078s2.296 1.02 2.296 2.078V43.5c0 13.215 11.25 23.75 24.909 23.75 13.66 0 24.91-10.535 24.91-23.75v-6.797c0-1.059.92-2.078 2.295-2.078S61 35.645 61 36.703V43.5c0 14.043-11.008 25.78-25.461 27.65l-1.744.227v9.467h10.591c1.375 0 2.296 1.02 2.296 2.078 0 1.059-.92 2.078-2.296 2.078H18.614c-1.375 0-2.296-1.02-2.296-2.078 0-1.059.92-2.078 2.296-2.078h10.59v-7.71ZM16.319 16.312C16.318 8.508 23.02 2 31.5 2s15.182 6.508 15.182 14.313V43.5c0 7.805-6.702 14.313-15.182 14.313S16.318 51.304 16.318 43.5V16.312Z"
              />
            </svg>
            {isRecording && (
              <canvas
                className="w-[500px] h-[500px] absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2"
                width="500"
                height="500"
                ref={canvasEl}></canvas>
            )}
          </button>
          {/* <audio ref={audioEl} controls className="fixed left-2 top-2" /> */}
          <p
            className={cn(
              'text-[rgba(55,55,55,0.50)] font-helvetica text-2xl max-w-[400px] text-center mt-9 transition-opacity'
            )}>
            {isRecording ? 'Говорите в микрофон' : 'Нажмите на микрофон и скажите какая услуга Вас интересует'}
          </p>
        </div>
      )}
    </>
  );
};
