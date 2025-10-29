
import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Animated } from 'react-native';
import StarRating from './StarRating';
import { cardStyles } from '../style/cardStyles';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface CardProps {
  id: string;
  imageUrl: string | number;
  name: string;
  rating: number;
  subtitle?: string;
  onCardClick?: (id: string) => void;
  interactive?: boolean;
  transparent?: boolean;
  // Novas props para melhorar a experiência
  deliveryTime?: string;
  deliveryFee?: string;
  distance?: string;
  hasPromotion?: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  imageUrl,
  name,
  rating,
  subtitle,
  onCardClick,
  interactive = true,
  transparent = false,
  deliveryTime,
  deliveryFee,
  distance,
  hasPromotion = false
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
          
          {/* Badges - apenas promoções */}
          <View style={cardStyles.badgeContainer}>
            {hasPromotion && (
              <View style={[cardStyles.badge, { backgroundColor: colors.rosaPromocao }]}>
                <Text style={cardStyles.badgeText}>Promo</Text>
              </View>
            )}
          </View>
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

          {/* Informações adicionais */}
          {(deliveryTime || deliveryFee || distance) && (
            <View style={cardStyles.infoRow}>
              {deliveryTime && (
                <View style={cardStyles.infoItem}>
                  <MaterialIcons name="access-time" size={14} color={colors.cinzaMedio} />
                  <Text style={cardStyles.infoText}>{deliveryTime}</Text>
                </View>
              )}
              {deliveryFee && (
                <View style={cardStyles.infoItem}>
                  <MaterialIcons name="local-shipping" size={14} color={colors.cinzaMedio} />
                  <Text style={cardStyles.infoText}>{deliveryFee}</Text>
                </View>
              )}
              {distance && (
                <View style={cardStyles.infoItem}>
                  <MaterialIcons name="location-on" size={14} color={colors.cinzaMedio} />
                  <Text style={cardStyles.infoText}>{distance}</Text>
                </View>
              )}
            </View>
          )}

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
