
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import Card from './Card';

interface CardData {
  id: string;
  imageUrl: string | number;
  name: string;
  rating: number;
  subtitle?: string;
}

interface HorizontalCardCarouselProps {
  cards: CardData[];
  onCardClick?: (id: string) => void;
}

const HorizontalCardCarousel: React.FC<HorizontalCardCarouselProps> = ({
  cards,
  onCardClick
}) => {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    if (onCardClick) onCardClick(id);
    router.push(`/perfilEmpresa?id=${id}`);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ 
        alignItems: 'center', 
        paddingHorizontal: 0,
        justifyContent: 'center',
        flexGrow: 1
      }}
      style={{ width: '100%' }}
    >
      {cards.map((card) => (
        <View key={card.id} style={{ 
          width: 320, 
          marginHorizontal: 8,
          alignItems: 'center',
        }}>
          <Card
            id={card.id}
            imageUrl={card.imageUrl}
            name={card.name}
            rating={card.rating}
            subtitle={card.subtitle}
            onCardClick={handleCardClick}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default HorizontalCardCarousel;
