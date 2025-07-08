import { Card } from 'antd'
import { BookOutlined, RocketOutlined, QuestionCircleOutlined, BulbOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

const suggestions = [
  {
    icon: <QuestionCircleOutlined className="text-2xl" />,
    title: '如何使用？',
    text: '了解智能知识库的基本使用方法',
  },
  {
    icon: <BookOutlined className="text-2xl" />,
    title: '知识管理',
    text: '学习如何添加和管理知识内容',
  },
  {
    icon: <RocketOutlined className="text-2xl" />,
    title: '快速开始',
    text: '查看快速入门指南',
  },
  {
    icon: <BulbOutlined className="text-2xl" />,
    title: '最佳实践',
    text: '探索使用技巧和最佳实践',
  },
]

interface WelcomeScreenProps {
  onSuggestionClick?: (text: string) => void
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <BookOutlined className="text-6xl text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎使用智能知识库</h2>
        <p className="text-gray-600">我是您的AI助手，随时为您解答问题</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {suggestions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card
              hoverable
              className="h-full cursor-pointer transition-all hover:shadow-lg"
              onClick={() => onSuggestionClick?.(item.text)}
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-500">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center text-sm text-gray-500"
      >
        <p>💡 提示：您可以随时切换知识库模式，获得更精准的回答</p>
      </motion.div>
    </motion.div>
  )
}