import React from 'react';
import { UserSettingsForm } from '@/components/forms/UserSettingsForm';
import { FormErrorBoundary } from '@/components/forms/FormErrorBoundary';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UserSettings {
  profile: {
    displayName: string;
    email?: string;
    bio?: string;
    timezone: string;
    language: 'zh-CN' | 'en-US';
  };
  ai: {
    preferredModel: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'local';
    temperature: number;
    maxTokens: number;
    useKnowledgeBase: boolean;
    autoSave: boolean;
    streamResponse: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
    layout: 'compact' | 'comfortable' | 'spacious';
    showWelcomeScreen: boolean;
    enableAnimations: boolean;
    sidebarCollapsed: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    soundEnabled: boolean;
    chatNotifications: boolean;
    systemUpdates: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    shareUsageData: boolean;
    allowDataCollection: boolean;
    sessionTimeout: number;
  };
  shortcuts: Array<{
    id: string;
    name: string;
    key: string;
    action: string;
    enabled: boolean;
  }>;
  customTags: Array<{
    id: string;
    name: string;
    color: string;
    description?: string;
  }>;
}

const defaultSettings: UserSettings = {
  profile: {
    displayName: '用户',
    email: '',
    bio: '',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN'
  },
  ai: {
    preferredModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    useKnowledgeBase: true,
    autoSave: true,
    streamResponse: true
  },
  ui: {
    theme: 'light',
    primaryColor: '#1890ff',
    fontSize: 'medium',
    layout: 'comfortable',
    showWelcomeScreen: true,
    enableAnimations: true,
    sidebarCollapsed: false
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    chatNotifications: true,
    systemUpdates: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  },
  privacy: {
    profileVisibility: 'team',
    shareUsageData: false,
    allowDataCollection: false,
    sessionTimeout: 60
  },
  shortcuts: [
    {
      id: '1',
      name: '新建聊天',
      key: 'Ctrl+N',
      action: 'new-chat',
      enabled: true
    },
    {
      id: '2',
      name: '搜索',
      key: 'Ctrl+K',
      action: 'search',
      enabled: true
    },
    {
      id: '3',
      name: '设置',
      key: 'Ctrl+,',
      action: 'settings',
      enabled: true
    }
  ],
  customTags: [
    {
      id: '1',
      name: '重要',
      color: '#f50',
      description: '标记重要内容'
    },
    {
      id: '2',
      name: '待处理',
      color: '#108ee9',
      description: '需要后续处理的内容'
    }
  ]
};

export const UserSettingsPage: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<UserSettings>('user-settings', defaultSettings);
  const [loading, setLoading] = React.useState(false);

  const handleSaveSettings = async (newSettings: UserSettings) => {
    try {
      setLoading(true);
      
      // 模拟异步保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 验证设置数据
      if (!newSettings.profile.displayName) {
        const { handleFormError } = await import('@/utils/errorHandler');
        handleFormError(new Error('显示名称不能为空'), '显示名称');
        return;
      }
      
      // 保存到本地存储
      setSettings(newSettings);
      
      // 应用一些设置
      applySettings(newSettings);
      
      const { showSuccess } = await import('@/utils/errorHandler');
      showSuccess('设置保存成功！');
    } catch (error) {
      const { handleBusinessError } = await import('@/utils/errorHandler');
      handleBusinessError('SETTINGS_SAVE_FAILED');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const applySettings = (newSettings: UserSettings) => {
    // 应用主题设置
    if (newSettings.ui.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 应用主色调
    document.documentElement.style.setProperty('--primary-color', newSettings.ui.primaryColor);
    
    // 应用字体大小
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.setProperty('--base-font-size', fontSizeMap[newSettings.ui.fontSize]);
    
    // 应用语言设置
    if (newSettings.profile.language === 'en-US') {
      // 可以在这里切换到英文界面
      console.log('Switching to English...');
    }
    
    // 注册键盘快捷键
    registerShortcuts(newSettings.shortcuts);
  };

  const registerShortcuts = (shortcuts: UserSettings['shortcuts']) => {
    // 清理现有的快捷键监听器
    document.removeEventListener('keydown', handleKeyDown);
    
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        if (!shortcut.enabled) return;
        
        const keys = shortcut.key.split('+');
        const ctrlKey = keys.includes('Ctrl');
        const shiftKey = keys.includes('Shift');
        const altKey = keys.includes('Alt');
        const key = keys[keys.length - 1];
        
        if (
          event.ctrlKey === ctrlKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey &&
          event.key.toLowerCase() === key.toLowerCase()
        ) {
          event.preventDefault();
          executeShortcutAction(shortcut.action);
        }
      });
    };
    
    document.addEventListener('keydown', handleKeyDown);
  };

  const executeShortcutAction = (action: string) => {
    switch (action) {
      case 'new-chat':
        message.info('新建聊天快捷键已触发');
        break;
      case 'search':
        message.info('搜索快捷键已触发');
        break;
      case 'settings':
        message.info('设置快捷键已触发');
        break;
      default:
        console.log(`Unknown shortcut action: ${action}`);
    }
  };

  React.useEffect(() => {
    // 初始化应用设置
    applySettings(settings);
    
    return () => {
      // 清理快捷键监听器
      document.removeEventListener('keydown', () => {});
    };
  }, [settings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <FormErrorBoundary>
        <UserSettingsForm
          onSave={handleSaveSettings}
          loading={loading}
          initialData={settings}
        />
      </FormErrorBoundary>
    </div>
  );
};