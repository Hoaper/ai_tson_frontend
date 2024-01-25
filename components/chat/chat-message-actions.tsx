'use client'

import { type Message } from 'ai'

import { Button } from '@/components/chat/ui/button'
import { useCopyToClipboard } from '@/libs/hooks/use-copy-to-clipboard'
import { cn } from '@/libs/utils'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
        className
      )}
      {...props}
    >
      <Button onClick={onCopy}>
        {isCopied ? <span>чек иконка</span> : <span>копия иконка</span>}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  )
}
