import React from 'react';
import { Layout, Spin } from "antd";
import { useChatStore } from "@/stores/chatStore";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";

const { Content } = Layout;

export const ChatPage: React.FC = () => {
  const {
    messages,
    loading,
    currentResponse,
    sendMessage,
  } = useChatStore();

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <Content className="flex flex-col flex-1">
        {messages.length === 0 && !loading ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <MessageList
            messages={messages}
            currentResponse={currentResponse}
            loading={loading}
            className="flex-1"
          />
        )}

        <div className="border-t bg-white">
          <div className="max-w-4xl mx-auto p-4">
            <ChatInput onSend={sendMessage} loading={loading} />
          </div>
        </div>

        {loading && !currentResponse && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5">
            <Spin size="large" tip="AI正在思考中..." />
          </div>
        )}
      </Content>
    </div>
  );
};