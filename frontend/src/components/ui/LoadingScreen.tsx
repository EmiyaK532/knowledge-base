import { Spin } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <BookOutlined className="text-6xl text-blue-500 mb-4" />
        <Spin size="large" />
        <p className="mt-4 text-gray-600">加载中...</p>
      </motion.div>
    </div>
  )
}