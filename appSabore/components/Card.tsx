
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
  variant?: 'default' | 'compact';
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
  hasPromotion = false,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const animScaleX = useRef(new Animated.Value(1)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const isCompact = variant === 'compact';
  const starSize = isCompact ? 16 : 18;
  const infoIconSize = isCompact ? 12 : 14;

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
          isCompact && cardStyles.cardCompact,
          transparent && cardStyles.cardTransparent,
          interactive && cardStyles.cardInteractive,
          isHovered && cardStyles.cardHovered,
          isHovered && isCompact && cardStyles.cardHoveredCompact
        ]}
        onPress={handleCardClick}
        disabled={!interactive || isAnimating}
        {...hoverProps}
      >
        {/* Imagem */}
        <View style={[
          cardStyles.imageContainer,
          isCompact && cardStyles.imageContainerCompact
        ]}>
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
          <View style={[
            cardStyles.badgeContainer,
            isCompact && cardStyles.badgeContainerCompact
          ]}>
            {hasPromotion && (
              <View style={[
                cardStyles.badge,
                isCompact && cardStyles.badgeCompact,
                { backgroundColor: colors.rosaPromocao }
              ]}>
                <Text style={[
                  cardStyles.badgeText,
                  isCompact && cardStyles.badgeTextCompact
                ]}>
                  Promo
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Conteúdo */}
        <View style={[
          cardStyles.content,
          isCompact && cardStyles.contentCompact
        ]}>
          <View>
            <View style={[
              cardStyles.titleContainer,
              isCompact && cardStyles.titleContainerCompact
            ]}>
              <Text
                style={[
                  cardStyles.title,
                  isCompact && cardStyles.titleCompact
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
            </View>
            {subtitle && (
              <View style={[
                cardStyles.descriptionContainer,
                isCompact && cardStyles.descriptionContainerCompact
              ]}>
                <Text
                  style={[
                    cardStyles.subtitle,
                    isCompact && cardStyles.subtitleCompact
                  ]}
                  numberOfLines={isCompact ? 2 : 2}
                  ellipsizeMode="tail"
                >
                  {subtitle}
                </Text>
              </View>
            )}
          </View>

          {/* Informações adicionais */}
          {(deliveryTime || deliveryFee || distance) && (
            <View style={[
              cardStyles.infoRow,
              isCompact && cardStyles.infoRowCompact
            ]}>
              {deliveryTime && (
                <View style={cardStyles.infoItem}>
                  <MaterialIcons name="access-time" size={infoIconSize} color={colors.cinzaMedio} />
                  <Text style={[
                    cardStyles.infoText,
                    isCompact && cardStyles.infoTextCompact
                  ]}>
                    {deliveryTime}
                  </Text>
                </View>
              )}
              {deliveryFee && (
                <View style={cardStyles.infoItem}>
                  <MaterialIcons name="local-shipping" size={infoIconSize} color={colors.cinzaMedio} />
                  <Text style={[
                    cardStyles.infoText,
                    isCompact && cardStyles.infoTextCompact
                  ]}>
                    {deliveryFee}
                  </Text>
                </View>
              )}
              {distance && (
                <View style={cardStyles.infoItem}>
                  <MaterialIcons name="location-on" size={infoIconSize} color={colors.cinzaMedio} />
                  <Text style={[
                    cardStyles.infoText,
                    isCompact && cardStyles.infoTextCompact
                  ]}>
                    {distance}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View>
            <View style={[
              cardStyles.ratingRow,
              isCompact && cardStyles.ratingRowCompact
            ]}>
              <StarRating rating={rating} size={starSize} />
              <View style={{ flex: 1 }} />
              <Text style={[
                cardStyles.ratingValue,
                isCompact && cardStyles.ratingValueCompact
              ]}>
                {rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
        <View style={[
          cardStyles.borderGlow,
          isCompact && cardStyles.borderGlowCompact,
          isHovered && cardStyles.borderGlowHovered
        ]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Card;
