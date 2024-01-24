import localFont from 'next/font/local'

export const fontHelvetica = localFont({
  src: [
    {
      path: '../public/fonts/HelveticaNeueCyr-Roman.woff2',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-helvetica'
})
