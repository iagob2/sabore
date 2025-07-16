import { Platform } from 'react-native';
import { toast as toastify, ToastOptions } from 'react-toastify';
import { ToastAndroid } from 'react-native';
import React from 'react';

interface ToastInput {
  title: string;
  description?: string;
  options?: ToastOptions;
}

export function toast({ title, description, options }: ToastInput) {
  if (Platform.OS === 'web') {
    toastify.info(
      <div>
        <strong>{title}</strong>
        {description && <div>{description}</div>}
      </div>,
      options
    );
  } else {
    // Toast nativo para Android
    ToastAndroid.showWithGravity(
      `${title}${description ? '\n' + description : ''}`,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  }
} 