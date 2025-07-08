import { Layout, Switch, Space, Typography } from 'antd'
import { BookOutlined, MenuOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const { Header: AntHeader } = Layout
const { Text } = Typography

interface HeaderProps {
  useKnowledgeBase: boolean
  onKnowledgeBaseChange: (checked: boolean) => void
  onMenuClick?: () => void
  className?: string
}

export function Header({ useKnowledgeBase, onKnowledgeBaseChange, onMenuClick, className }: HeaderProps) {
  return (
    <AntHeader className={cn('bg-white shadow-sm px-4 md:px-8 flex items-center justify-between sticky top-0 z-50', className)}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MenuOutlined className="text-xl" />
        </button>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <BookOutlined className="text-2xl text-blue-600" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            智能知识库
          </h1>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Space className="flex items-center">
          <Text className="hidden sm:inline text-gray-600">知识库模式</Text>
          <Switch
            checked={useKnowledgeBase}
            onChange={onKnowledgeBaseChange}
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
        </Space>
      </motion.div>
    </AntHeader>
  )
}