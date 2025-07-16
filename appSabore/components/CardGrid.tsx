
import React from 'react';
import Card from './Card';

interface CardData {
  id: string;
  imageUrl: string;
  name: string;
  rating: number;
  subtitle?: string;
}

interface CardGridProps {
  cards: CardData[];
  onCardClick?: (id: string) => void;
  columns?: number;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  columns = 4
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6 p-6`}>
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          imageUrl={card.imageUrl}
          name={card.name}
          rating={card.rating}
          subtitle={card.subtitle}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default CardGrid;
