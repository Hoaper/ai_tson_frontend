'use client'

import * as React from 'react'

import { cn } from '@/libs/utils'
import { useAtBottom } from '@/libs/hooks/use-at-bottom'
import { Button, type ButtonProps } from '@/components/chat/ui/button'


export function ButtonScrollToBottom({ className, ...props }: ButtonProps) {
  const isAtBottom = useAtBottom()

  return (
    <Button
      className={cn(
        'absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2 max-md:top-[-30px]',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className
      )}
      onClick={() =>
        window.scrollTo({
          top: document.body.offsetHeight,
          behavior: 'smooth'
        })
      }
      {...props}
    >
      <span>иконка вниз</span>
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  )
}
