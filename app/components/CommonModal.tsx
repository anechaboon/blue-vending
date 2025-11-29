'use client';

import React from 'react';
import ReactDOM from 'react-dom';

interface CommonModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  onClose: () => void;
}

export default function CommonModal({
  open,
  title = 'Title',
  children,
  footer,
  width = '400px',
  onClose,
}: CommonModalProps) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg flex flex-col"
        style={{
          width,
          maxHeight: '90vh', // กำหนดความสูงสูงสุดของ modal
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <h2 className="text-xl font-semibold px-5 pt-5 pb-3 border-b">
            {title}
          </h2>
        )}

        {/* Body (Scroll ตรงนี้) */}
        <div className="px-5 py-4 overflow-y-auto">{children}</div>

        {/* Footer (fix ด้านล่าง) */}
        {footer && (
          <div className="px-5 py-4 border-t bg-gray-50">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
