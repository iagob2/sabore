import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Carregando...',
  color = colors.verdeFolha 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de rotação
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Animação de pulso
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, [spinValue, pulseValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 36;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 18;
      default: return 14;
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          transform: [
            { rotate: spin },
            { scale: pulseValue }
          ],
          marginBottom: 12,
        }}
      >
        <MaterialIcons 
          name="restaurant" 
          size={getSize()} 
          color={color} 
        />
      </Animated.View>
      {text && (
        <Text style={{
          color: colors.cinzaMedio,
          fontSize: getTextSize(),
          fontWeight: '500',
          textAlign: 'center',
        }}>
          {text}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner;
