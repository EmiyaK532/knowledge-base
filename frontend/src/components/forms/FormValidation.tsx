import React from 'react';
import { Alert, Tooltip } from 'antd';
import { 
  ExclamationCircleOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined,
  WarningOutlined 
} from '@ant-design/icons';
import { type FieldError, type FieldErrors } from 'react-hook-form';

// 单个字段错误显示组件
interface FieldErrorMessageProps {
  error?: FieldError | string;
  className?: string;
  showIcon?: boolean;
}

export const FieldErrorMessage: React.FC<FieldErrorMessageProps> = ({
  error,
  className = '',
  showIcon = true
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;
  
  if (!errorMessage) return null;

  return (
    <div className={`mt-1 flex items-center gap-1 text-red-600 text-sm ${className}`}>
      {showIcon && <ExclamationCircleOutlined className="text-red-500" />}
      <span>{errorMessage}</span>
    </div>
  );
};

// 字段成功状态显示组件
interface FieldSuccessMessageProps {
  message: string;
  className?: string;
  showIcon?: boolean;
}

export const FieldSuccessMessage: React.FC<FieldSuccessMessageProps> = ({
  message,
  className = '',
  showIcon = true
}) => {
  return (
    <div className={`mt-1 flex items-center gap-1 text-green-600 text-sm ${className}`}>
      {showIcon && <CheckCircleOutlined className="text-green-500" />}
      <span>{message}</span>
    </div>
  );
};

// 字段帮助信息显示组件
interface FieldHelpMessageProps {
  message: string;
  className?: string;
  showIcon?: boolean;
}

export const FieldHelpMessage: React.FC<FieldHelpMessageProps> = ({
  message,
  className = '',
  showIcon = true
}) => {
  return (
    <div className={`mt-1 flex items-center gap-1 text-gray-500 text-sm ${className}`}>
      {showIcon && <InfoCircleOutlined className="text-gray-400" />}
      <span>{message}</span>
    </div>
  );
};

// 字段警告信息显示组件
interface FieldWarningMessageProps {
  message: string;
  className?: string;
  showIcon?: boolean;
}

export const FieldWarningMessage: React.FC<FieldWarningMessageProps> = ({
  message,
  className = '',
  showIcon = true
}) => {
  return (
    <div className={`mt-1 flex items-center gap-1 text-orange-600 text-sm ${className}`}>
      {showIcon && <WarningOutlined className="text-orange-500" />}
      <span>{message}</span>
    </div>
  );
};

// 表单级别错误汇总组件
interface FormErrorSummaryProps {
  errors: FieldErrors;
  className?: string;
  title?: string;
  maxErrors?: number;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  className = '',
  title = '请修正以下错误',
  maxErrors = 5
}) => {
  const errorList = React.useMemo(() => {
    const flattenErrors = (obj: any, prefix = ''): string[] => {
      const errorMessages: string[] = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object') {
          if ('message' in value && typeof value.message === 'string') {
            errorMessages.push(`${fullKey}: ${value.message}`);
          } else {
            errorMessages.push(...flattenErrors(value, fullKey));
          }
        }
      }
      
      return errorMessages;
    };
    
    return flattenErrors(errors).slice(0, maxErrors);
  }, [errors, maxErrors]);

  if (errorList.length === 0) return null;

  return (
    <Alert
      message={title}
      description={
        <ul className="list-disc list-inside space-y-1">
          {errorList.map((error, index) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
          {Object.keys(errors).length > maxErrors && (
            <li className="text-sm text-gray-500">
              还有 {Object.keys(errors).length - maxErrors} 个其他错误...
            </li>
          )}
        </ul>
      }
      type="error"
      showIcon
      className={className}
    />
  );
};

// 实时验证状态指示器
interface ValidationStatusProps {
  isValidating?: boolean;
  isValid?: boolean;
  hasError?: boolean;
  className?: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  isValidating = false,
  isValid = false,
  hasError = false,
  className = ''
}) => {
  if (isValidating) {
    return (
      <Tooltip title="正在验证...">
        <div className={`animate-spin h-4 w-4 border-2 border-blue-300 border-t-blue-600 rounded-full ${className}`} />
      </Tooltip>
    );
  }

  if (hasError) {
    return (
      <Tooltip title="验证失败">
        <ExclamationCircleOutlined className={`text-red-500 ${className}`} />
      </Tooltip>
    );
  }

  if (isValid) {
    return (
      <Tooltip title="验证通过">
        <CheckCircleOutlined className={`text-green-500 ${className}`} />
      </Tooltip>
    );
  }

  return null;
};

// 字段包装器 - 包含标签、输入框、错误信息等
interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  error?: FieldError | string;
  success?: string;
  help?: string;
  warning?: string;
  children: React.ReactNode;
  className?: string;
  isValidating?: boolean;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  required = false,
  error,
  success,
  help,
  warning,
  children,
  className = '',
  isValidating = false
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        <div className="ml-2 inline-block">
          <ValidationStatus 
            isValidating={isValidating}
            isValid={!!success && !error}
            hasError={!!error}
          />
        </div>
      </label>
      
      {children}
      
      {error && <FieldErrorMessage error={error} />}
      {!error && success && <FieldSuccessMessage message={success} />}
      {!error && !success && warning && <FieldWarningMessage message={warning} />}
      {!error && !success && !warning && help && <FieldHelpMessage message={help} />}
    </div>
  );
};

// 表单验证进度条
interface ValidationProgressProps {
  totalFields: number;
  validFields: number;
  className?: string;
}

export const ValidationProgress: React.FC<ValidationProgressProps> = ({
  totalFields,
  validFields,
  className = ''
}) => {
  const percentage = totalFields > 0 ? (validFields / totalFields) * 100 : 0;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>表单完成度</span>
        <span>{validFields}/{totalFields} 字段</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};