import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '../ui/Button';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  destructive,
  tone = 'light'









}: {open: boolean;onClose: () => void;onConfirm: () => void;title: string;message: string;confirmLabel?: string;destructive?: boolean;tone?: 'light' | 'dark';}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      tone={tone}
      footer={
      <>
          <Button variant={tone === 'dark' ? 'outline-dark' : 'secondary'} onClick={onClose}>
            Annuler
          </Button>
          <Button
          variant={destructive ? 'danger' : 'primary'}
          onClick={() => {
            onConfirm();
            onClose();
          }}>
          
            {confirmLabel}
          </Button>
        </>
      }>
      
      <div className="flex gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          destructive ? 'bg-red-50 text-eco-red' : 'bg-sky-50 text-ocean'}`
          }>
          
          <AlertTriangleIcon className="h-5 w-5" />
        </span>
        <p className={tone === 'light' ? 'text-sm text-slate-600' : 'text-sm text-slate-300'}>{message}</p>
      </div>
    </Modal>);

}