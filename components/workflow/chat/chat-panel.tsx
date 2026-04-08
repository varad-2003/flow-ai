import React, { useState } from 'react'
import {UIMessage, useChat} from"@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from '@/components/ui/button'
import { ArrowUp, PlusIcon, SparkleIcon } from 'lucide-react'
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import { Loader } from '@/components/ui/loader'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputMessage, PromptInputSubmit, PromptInputTextarea } from '@/components/ai-elements/prompt-input'

const ChatPanel = ({workflowId}: {workflowId: string}) => {
    const [input, setInput] = useState<string>("")
    const [chatId, setChatId] = useState<string | null>(() => crypto.randomUUID()
    )

    const { messages, sendMessage, status } = useChat<UIMessage>({
        id: chatId ?? undefined,
        messages: [],
        transport: new DefaultChatTransport({
            api: `/api/chat`,
        })
    })

    const isLoading = status === "submitted" || status === "streaming" && !Boolean(
        messages[messages.length - 1]?.parts.some(
            (part) => part.type === "text" && Boolean(part.text)
        )
    )

    const handleSubmit = (message: PromptInputMessage) => {
        if(!message.text?.trim()) return
        sendMessage({
            text: message.text
        })
        setInput("")
    }
  return (
    <div className='flex flex-col h-full bg-background overflow-hidden'>
        {/* {chat header} */}
        <div className='bg-linear-to-br from-primary via-primary/90 to-primary/80 px-6 py-4 relative shadow-sm'>
            <div className='flex items-center justify-between text-white'>
                <h5 className='text-lg font-bold'>Workflow Preview</h5>
                <Button variant="ghost" size="sm" onClick={() => setChatId(crypto.randomUUID())} >
                    NewChat <PlusIcon size={14} />
                </Button>
            </div>
        </div>
        <div className='relative flex flex-col flex-1 overflow-hidden'>
            {messages.length > 0 ? (
                <Conversation className='flex-1 '>
                    <ConversationContent className='pt-10 px-4'>
                        {messages.map((message) => (
                            <Message
                                from={message.role}
                                key={message.id}
                            >
                                <MessageContent className='text-[14.5px]'>
                                    {message.parts.map((part, index) => {
                                        switch(part.type) {
                                            case "text":
                                                return(
                                                    <MessageResponse 
                                                        key={`${message.id}-${index}`}
                                                    >
                                                        {part.text}
                                                    </MessageResponse>
                                                )
                                                default:
                                                    return null;
                                        }
                                    })}
                                </MessageContent>
                            </Message>
                        ))}
                        {
                            isLoading ? (
                                <div className='px-2'>
                                    <Loader variant={"dots"} size={"md"} />
                                </div>
                            ) : null
                        }
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>
            ) : (
                <div className='flex-1 flex items-center justify-center'>
                    <Empty className='border-0'>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <SparkleIcon size={20} className='text-primary' />
                            </EmptyMedia>
                            <EmptyTitle>Preview your workflows</EmptyTitle>
                            <EmptyDescription>Write a prompt as if you are the user to test your workflow</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}
            <div className='p-4 bg-background border-t'>
                <PromptInput 
                className='rounded-xl! shadow-sm border'
                onSubmit={handleSubmit}
                >
                    
                    <PromptInputBody>
                        <PromptInputTextarea 
                        value={input}
                        placeholder='Send a message...'
                        className='pt-3'
                        onChange={(e) => setInput(e.target.value)}
                        />
                    </PromptInputBody>
                    <PromptInputFooter className='flex justify-end p-2 pt-0'>
                        <PromptInputSubmit 
                        disabled={!input.trim() || isLoading}
                        className='h-9! w-9! p-0! rounded-xl! bg-primary! text-primary-foreground!'
                        >
                            <ArrowUp size={18} />
                        </PromptInputSubmit>
                    </PromptInputFooter>
                </PromptInput>
            </div>
        </div>
    </div>
  )
}

export default ChatPanel