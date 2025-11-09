
import React, { useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions, TouchableOpacity, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import Card from './Card';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface CardData {
  id: string;
  imageUrl: string | number;
  name: string;
  rating: number;
  subtitle?: string;
  // Novas propriedades para melhorar a experiência
  deliveryTime?: string;
  deliveryFee?: string;
  distance?: string;
  hasPromotion?: boolean;
}

interface HorizontalCardCarouselProps {
  cards: CardData[];
  onCardClick?: (id: string) => void;
  title?: string;
  cardVariant?: 'default' | 'compact';
}

const HorizontalCardCarousel: React.FC<HorizontalCardCarouselProps> = ({
  cards,
  onCardClick,
  title,
  cardVariant = 'default',
}) => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { width: screenWidth } = useWindowDimensions();
  const isCompact = cardVariant === 'compact';
  const cardWidth = isCompact
    ? Math.min(220, Math.max(180, Math.floor(screenWidth * 0.58)))
    : Math.min(320, Math.max(260, Math.floor(screenWidth * 0.8)));
  const sideMargin = screenWidth < 360 ? 8 : 12;
  const scrollStep = cardWidth + sideMargin * 2;

  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const handleCardClick = (id: string) => {
    if (onCardClick) onCardClick(id);
    router.push(`/perfilEmpresa?id=${id}`);
  };

  const displayCards = cards;
  const maxScroll = Math.max(0, contentWidth - screenWidth);
  const canScrollLeft = scrollPosition > 16;
  const canScrollRight = scrollPosition < maxScroll - 16;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollPosition(event.nativeEvent.contentOffset.x);
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const target =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollStep)
        : Math.min(maxScroll, scrollPosition + scrollStep);
    scrollRef.current.scrollTo({ x: target, animated: true });
    setScrollPosition(target);
  };

  if (displayCards.length === 0) {
    return (
      <View style={{ 
        alignItems: 'center', 
        paddingVertical: 40,
        paddingHorizontal: 20 
      }}>
        <MaterialIcons 
          name="restaurant" 
          size={48} 
          color={colors.cinzaClaro} 
        />
        <Text style={{ 
          color: colors.cinzaMedio, 
          fontSize: 16, 
          marginTop: 16,
          textAlign: 'center' 
        }}>
          Nenhum restaurante encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={{ width: '100%' }}>
      {title && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingHorizontal: 16
        }}>
          <Text style={{ 
            color: colors.verdeFolha, 
            fontSize: 20, 
            fontWeight: '600' 
          }}>
            {title}
          </Text>
        </View>
      )}
      
      <View style={{ position: 'relative' }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(w) => setContentWidth(w)}
          contentContainerStyle={{ 
            alignItems: 'center', 
            paddingHorizontal: 16,
            justifyContent: 'flex-start',
            paddingBottom: 8
          }}
          style={{ width: '100%' }}
          decelerationRate="fast"
          snapToInterval={scrollStep}
          snapToAlignment="center"
        >
          {displayCards.map((card) => (
            <View key={card.id} style={{ 
              width: cardWidth, 
              marginHorizontal: sideMargin,
              alignItems: 'center',
            }}>
              <Card
                id={card.id}
                imageUrl={card.imageUrl}
                name={card.name}
                rating={card.rating}
                subtitle={card.subtitle}
                deliveryTime={card.deliveryTime}
                deliveryFee={card.deliveryFee}
                distance={card.distance}
                hasPromotion={card.hasPromotion}
                onCardClick={handleCardClick}
                variant={cardVariant}
              />
            </View>
          ))}
        </ScrollView>
        {displayCards.length > 1 && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'flex-end',
              left: 0,
              pointerEvents: 'box-none',
            }}
          >
            {/* Left Arrow */}
            <TouchableOpacity
              onPress={() => scrollTo('left')}
              disabled={!canScrollLeft}
              activeOpacity={0.7}
              style={{
                position: 'absolute',
                left: 12,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.overlayEscuro,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: canScrollLeft ? 1 : 0.3,
                shadowColor: colors.preto,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
                pointerEvents: canScrollLeft ? 'auto' : 'none',
              }}
            >
              <MaterialIcons
                name="chevron-left"
                size={22}
                color={colors.branco}
              />
            </TouchableOpacity>

            {/* Right Arrow */}
            <TouchableOpacity
              onPress={() => scrollTo('right')}
              disabled={!canScrollRight}
              activeOpacity={0.7}
              style={{
                position: 'absolute',
                right: 12,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.overlayEscuro,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: canScrollRight ? 1 : 0.3,
                shadowColor: colors.preto,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
                pointerEvents: canScrollRight ? 'auto' : 'none',
              }}
            >
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={colors.branco}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default HorizontalCardCarousel;
