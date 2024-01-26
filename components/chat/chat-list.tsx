import { type Message } from 'ai'

// import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat/chat-message'

export interface ChatList {
  messages: Message[]
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-10 px-4 max-md:max-w-[100vw]">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
        </div>
      ))}
    </div>
  )
}