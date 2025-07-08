import { useEffect, useRef } from 'react'
import { Card, Tag, Typography } from 'antd'
import { RobotOutlined, UserOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { Message } from '@/stores/chatStore'

const { Paragraph } = Typography

interface MessageListProps {
  messages: Message[]
  currentResponse?: string
  loading?: boolean
  className?: string
}

export function MessageList({ messages, currentResponse, loading, className }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentResponse])

  return (
    <div className={cn('flex-1 overflow-y-auto px-4 py-6 space-y-4', className)}>
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={cn(
                'shadow-sm border-0',
                message.role === 'user'
                  ? 'bg-blue-50 ml-auto max-w-[80%] md:max-w-[60%]'
                  : 'bg-white mr-auto max-w-[90%] md:max-w-[80%]'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <UserOutlined className="text-blue-500 text-xl" />
                  ) : (
                    <RobotOutlined className="text-purple-500 text-xl" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Tag color={message.role === 'user' ? 'blue' : 'purple'} className="mb-2">
                    {message.role === 'user' ? '您' : 'AI助手'}
                  </Tag>
                  <Paragraph className="!mb-0 whitespace-pre-wrap break-words">
                    {message.content}
                  </Paragraph>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {loading && currentResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white shadow-sm border-0 mr-auto max-w-[90%] md:max-w-[80%]">
              <div className="flex items-start gap-3">
                <RobotOutlined className="text-purple-500 text-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Tag color="purple" className="mb-2">
                    AI助手
                  </Tag>
                  <Paragraph className="!mb-0 whitespace-pre-wrap break-words">
                    {currentResponse}
                    <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1 align-middle" />
                  </Paragraph>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  )
}