import { type Message } from 'ai'

// import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat/chat-message'
import { cn } from '@/libs/utils'

export interface ChatList {
  messages: Message[],
  isModal: boolean
}

export function ChatList({ messages, isModal }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className={cn("relative  max-md:max-w-[100vw]", isModal ? '' : 'mx-10 px-4')}>
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
        </div>
      ))}
    </div>
  )
}