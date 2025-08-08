
import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Animated } from 'react-native';
import StarRating from './StarRating';
import { cardStyles } from '../style/cardStyles';

interface CardProps {
  id: string;
  imageUrl: string | number;
  name: string;
  rating: number;
  subtitle?: string;
  onCardClick?: (id: string) => void;
  interactive?: boolean;
  transparent?: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  imageUrl,
  name,
  rating,
  subtitle,
  onCardClick,
  interactive = true,
  transparent = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const animScaleX = useRef(new Animated.Value(1)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = () => {
    if (!interactive || isAnimating) return;
    setIsAnimating(true);
    Animated.timing(animScaleX, {
      toValue: 0,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      setIsAnimating(false);
      animScaleX.setValue(1);
      if (onCardClick) onCardClick(id);
    });
  };

  // Props para hover apenas no web
  const hoverProps = Platform.OS === 'web' ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  return (
    <Animated.View style={{ transform: [{ scaleX: animScaleX }] }}>
      <TouchableOpacity
        activeOpacity={interactive ? 0.85 : 1}
        style={[
          cardStyles.card,
          transparent && cardStyles.cardTransparent,
          interactive && cardStyles.cardInteractive,
          isHovered && cardStyles.cardHovered
        ]}
        onPress={handleCardClick}
        disabled={!interactive || isAnimating}
        {...hoverProps}
      >
        {/* Imagem */}
        <View style={cardStyles.imageContainer}>
          <Image
            source={typeof imageUrl === 'string' && imageUrl ? { uri: imageUrl } : (imageUrl as number)}
            style={[
              cardStyles.image,
              imageLoaded && cardStyles.imageLoaded,
              isHovered && cardStyles.imageHovered
            ]}
            onLoad={() => setImageLoaded(true)}
          />
          <View style={cardStyles.gradient} />
        </View>
        {/* Conteúdo */}
        <View style={cardStyles.content}>
          <View>
            <View style={cardStyles.titleContainer}>
              <Text style={cardStyles.title} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
            </View>
            {subtitle && (
              <View style={cardStyles.descriptionContainer}>
                <Text style={cardStyles.subtitle} numberOfLines={2} ellipsizeMode="tail">{subtitle}</Text>
              </View>
            )}
          </View>
          <View>
            <View style={cardStyles.ratingRow}>
              <StarRating rating={rating} size={18} />
              <View style={{ flex: 1 }} />
              <Text style={cardStyles.ratingValue}>{rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <View style={[cardStyles.borderGlow, isHovered && cardStyles.borderGlowHovered]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Card;
