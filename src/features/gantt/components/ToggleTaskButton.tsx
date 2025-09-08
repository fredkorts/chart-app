import React from 'react';
import { Button } from 'antd';
import { GANTT_ACTIONS } from '../constants';

interface ToggleTaskButtonProps {
  panelMode: 'chart' | 'add' | 'details' | 'edit' | 'confirm-delete';
  onToggle: () => void;
  className?: string;
}

export const ToggleTaskButton: React.FC<ToggleTaskButtonProps> = ({
  panelMode,
  onToggle,
  className = '',
}) => {
  const isChart = panelMode === 'chart';

  return (
    <Button
      htmlType="button"
      icon={isChart ? '+' : '×'}
      onClick={onToggle}
      className={`toggle-task-button ${className}`.trim()}
    >
      {isChart ? GANTT_ACTIONS.ADD_TASK : GANTT_ACTIONS.VIEW_CHART}
    </Button>
  );
};

export default ToggleTaskButton;
