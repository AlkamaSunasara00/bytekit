import React from "react";
import { CheckIcon } from "./icons";

export interface ToastItem {
  id: string;
  message: string;
}

interface ToastProps {
  toasts: ToastItem[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <CheckIcon size={16} stroke="#1D9E75" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
