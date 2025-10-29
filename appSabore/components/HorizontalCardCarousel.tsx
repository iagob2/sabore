
import React, { useState } from 'react';
import { ScrollView, View, useWindowDimensions, TouchableOpacity, Text } from 'react-native';
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
}

const HorizontalCardCarousel: React.FC<HorizontalCardCarouselProps> = ({
  cards,
  onCardClick,
  title
}) => {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.min(320, Math.max(260, Math.floor(screenWidth * 0.8)));
  const sideMargin = screenWidth < 360 ? 8 : 12;

  const handleCardClick = (id: string) => {
    if (onCardClick) onCardClick(id);
    router.push(`/perfilEmpresa?id=${id}`);
  };

  const displayCards = cards;

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
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          alignItems: 'center', 
          paddingHorizontal: 16,
          justifyContent: 'flex-start',
          paddingBottom: 8
        }}
        style={{ width: '100%' }}
        decelerationRate="fast"
        snapToInterval={cardWidth + (sideMargin * 2)}
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
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HorizontalCardCarousel;
