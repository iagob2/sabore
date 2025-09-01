import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface BadgeProps {
  text: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'promotion' | 'new';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  icon?: string;
  disabled?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  text, 
  type = 'info', 
  size = 'medium',
  onPress,
  icon,
  disabled = false
}) => {
  const getBadgeStyle = () => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: 12,
      shadowColor: colors.preto,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
      },
      medium: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
      },
      large: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
      },
    };

    const typeStyles = {
      success: {
        backgroundColor: colors.verdeSucesso,
        borderColor: colors.verdeSucesso,
      },
      warning: {
        backgroundColor: colors.laranjaAviso,
        borderColor: colors.laranjaAviso,
      },
      error: {
        backgroundColor: colors.vermelhoErro,
        borderColor: colors.vermelhoErro,
      },
      info: {
        backgroundColor: colors.azulInfo,
        borderColor: colors.azulInfo,
      },
      promotion: {
        backgroundColor: colors.rosaPromocao,
        borderColor: colors.rosaPromocao,
      },
      new: {
        backgroundColor: colors.azulRio,
        borderColor: colors.azulRio,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...typeStyles[type],
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      color: colors.branco,
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
    };

    const sizeStyles = {
      small: { fontSize: 10 },
      medium: { fontSize: 12 },
      large: { fontSize: 14 },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
    };
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 16;
      default: return 14;
    }
  };

  const BadgeContent = () => (
    <View style={getBadgeStyle()}>
      {icon && (
        <MaterialIcons 
          name={icon as any} 
          size={getIconSize()} 
          color={colors.branco} 
        />
      )}
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <BadgeContent />
      </TouchableOpacity>
    );
  }

  return <BadgeContent />;
};

export default Badge;
