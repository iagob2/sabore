import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';

interface ActionButtonProps {
  text: string;
  icon?: string;
  onPress?: () => void;
  url?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: any;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  icon,
  onPress,
  url,
  variant = 'primary',
  disabled = false,
  style
}) => {
  const handlePress = () => {
    if (disabled) return;
    
    if (url) {
      Linking.openURL(url);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        variant === 'secondary' && styles.actionBtnAlt,
        disabled && styles.actionBtnDisabled,
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      <Text style={[
        styles.actionBtnText,
        variant === 'secondary' && styles.actionBtnTextAlt,
        disabled && styles.actionBtnTextDisabled
      ]}>
        {icon && `${icon} `}{text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBBF24',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    justifyContent: 'center',
    shadowColor: '#FBBF24',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  actionBtnAlt: {
    backgroundColor: '#fff',
  },
  actionBtnDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  actionBtnText: {
    color: '#18181b',
    fontWeight: 'bold',
    fontSize: 19,
    marginLeft: 0,
  },
  actionBtnTextAlt: {
    color: '#dc3545',
  },
  actionBtnTextDisabled: {
    color: '#999',
  },
});

export default ActionButton; 