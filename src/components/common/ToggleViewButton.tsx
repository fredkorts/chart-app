import React, { useState, useEffect } from 'react';
import { Button, FloatButton } from 'antd';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { GANTT_ACTIONS } from '@/features/gantt';

interface ToggleViewButtonProps {
  panelMode: 'chart' | 'add' | 'details' | 'edit' | 'confirm-delete';
  onToggle: () => void;
  className?: string;
}

export const ToggleViewButton: React.FC<ToggleViewButtonProps> = ({
  panelMode,
  onToggle,
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const isChart = panelMode === 'chart';

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mobile version with FloatButton
  if (isMobile) {
    return (
      <FloatButton
        icon={isChart ? <PlusOutlined /> : <LeftOutlined />}
        onClick={onToggle}
        className={`toggle-view-button ${className}`.trim()}
        tooltip={isChart ? GANTT_ACTIONS.ADD_TASK : GANTT_ACTIONS.VIEW_CHART}
        type={isChart ? 'primary' : 'default'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      />
    );
  }

  // Desktop version with regular Button
  return (
    <Button
      htmlType="button"
      icon={isChart ? <PlusOutlined /> : <LeftOutlined />}
      onClick={onToggle}
      className={`toggle-view-button ${className}`.trim()}
      type={isChart ? 'primary' : 'default'}
    >
      {isChart ? GANTT_ACTIONS.ADD_TASK : GANTT_ACTIONS.VIEW_CHART}
    </Button>
  );
};

export default ToggleViewButton;