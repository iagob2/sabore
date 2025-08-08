import { Platform, ToastAndroid } from 'react-native';
import React from 'react';

export type ToastKind = 'info' | 'success' | 'error';

export interface ToastInput {
  title: string;
  description?: string;
  type?: ToastKind;
}

let showToastRef: null | ((args: ToastInput) => void) = null;

export function registerToast(showFn: (args: ToastInput) => void) {
  showToastRef = showFn;
}

export function toast({ title, description, type }: ToastInput) {
  if (showToastRef) {
    showToastRef({ title, description, type });
    return;
  }
  if (Platform.OS === 'web') {
    // Fallback simples no navegador caso o Provider não esteja montado
    // eslint-disable-next-line no-alert
    alert(`${title}${description ? '\n' + description : ''}`);
  } else {
    ToastAndroid.showWithGravity(
      `${title}${description ? '\n' + description : ''}`,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  }
}