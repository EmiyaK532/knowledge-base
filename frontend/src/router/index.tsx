import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ChatPage } from '@/pages/ChatPage';
import { KnowledgeManagePage } from '@/pages/KnowledgeManagePage';
import { UserSettingsPage } from '@/pages/UserSettingsPage';
import { TestPage } from '@/pages/TestPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ChatPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      },
      {
        path: 'knowledge',
        element: <KnowledgeManagePage />
      },
      {
        path: 'settings',
        element: <UserSettingsPage />
      },
      {
        path: 'test',
        element: <TestPage />
      }
    ]
  }
]);