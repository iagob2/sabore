
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { inputStyles } from '../style/inputStyles';
import { colors } from '../style/colors';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText, label, secureTextEntry }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={inputStyles.container}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <TextInput
        style={[inputStyles.field, isFocused && inputStyles.fieldFocused]}
        placeholder={placeholder}
        placeholderTextColor={colors.preto + '88'}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

export default Input;
