
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, KeyboardTypeOptions } from 'react-native';
import { inputStyles } from '../style/inputStyles';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  secureTextEntry?: boolean;
  icon?: string;
  onIconPress?: () => void;
  error?: string;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const Input: React.FC<InputProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  label, 
  secureTextEntry,
  icon,
  onIconPress,
  error,
  disabled = false,
  keyboardType
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={inputStyles.container}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <Animated.View style={[
        inputStyles.inputContainer,
        isFocused && inputStyles.inputContainerFocused,
        error && inputStyles.inputContainerError,
        disabled && inputStyles.inputContainerDisabled,
        {
          shadowOpacity: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.1],
          }),
          shadowRadius: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 8],
          }),
        }
      ]}>
        {icon && (
          <MaterialIcons 
            name={icon as any} 
            size={20} 
            color={isFocused ? colors.verdeFolha : colors.cinzaMedio} 
            style={inputStyles.leftIcon}
          />
        )}
        <TextInput
          style={[
            inputStyles.field,
            icon && inputStyles.fieldWithIcon,
            secureTextEntry && inputStyles.fieldWithSecureIcon
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.cinzaMedio}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={inputStyles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons 
              name={showPassword ? "visibility" : "visibility-off"} 
              size={20} 
              color={colors.cinzaMedio} 
            />
          </TouchableOpacity>
        )}
        {onIconPress && icon && (
          <TouchableOpacity
            onPress={onIconPress}
            style={inputStyles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons 
              name={icon as any} 
              size={20} 
              color={colors.verdeFolha} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <View style={inputStyles.errorContainer}>
          <MaterialIcons name="error-outline" size={14} color={colors.vermelhoErro} />
          <Text style={inputStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;
