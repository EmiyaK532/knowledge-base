import { useState, KeyboardEvent } from 'react'
import { SendOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const { TextArea } = Input

interface ChatInputProps {
  onSend: (message: string) => void
  loading?: boolean
  className?: string
}

export function ChatInput({ onSend, loading, className }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('w-full', className)}
    >
      <div className="relative">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          className="pr-20 text-base resize-none"
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          disabled={!input.trim() || loading}
          className="absolute bottom-2 right-2"
        >
          {loading ? '思考中' : '发送'}
        </Button>
      </div>
    </motion.div>
  )
}