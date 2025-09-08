import React from 'react';
import { Button, Flex, Space } from 'antd';

export interface DeleteConfirmationProps {
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) => (
  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
    <p style={{ textAlign: 'center' }}>{message}</p>
    <Flex gap="small" justify="center" style={{ paddingTop: 16 }}>
      <Button onClick={onCancel}>{cancelLabel}</Button>
      <Button danger onClick={onConfirm}>{confirmLabel}</Button>
    </Flex>
  </Space>
);