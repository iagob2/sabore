
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Text, TouchableWithoutFeedback } from 'react-native';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  onPress?: () => void; // Nova prop opcional
}

const GOLD_GRADIENT = [
  { offset: '0%', color: '#FDE68A' },
  { offset: '50%', color: '#FBBF24' },
  { offset: '100%', color: '#F59E0B' },
];

const StarIcon = ({ filled, half, size = 24, glow = false }: { filled?: boolean; half?: boolean; size?: number; glow?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
        {GOLD_GRADIENT.map((g, i) => (
          <Stop key={i} offset={g.offset} stopColor={g.color} />
        ))}
      </LinearGradient>
    </Defs>
    <Path
      d="M12 2.5l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 15.62l-5-4.87 6.91-.99L12 2.5z"
      fill={filled || half ? 'url(#gold)' : '#333'}
      stroke={filled || half ? '#FBBF24' : '#555'}
      strokeWidth={filled || half ? 1.2 : 1}
    />
    {half && (
      <Path
        d="M12 2.5l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77V2.5z"
        fill="url(#gold)"
        stroke="#FBBF24"
        strokeWidth={1.2}
      />
    )}
  </Svg>
);

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 24,
  interactive = false,
  onRatingChange,
  onPress // Nova prop
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(rating);
  const [pressed, setPressed] = useState(false);

  const handleStarClick = (starIndex: number) => {
    if (!interactive) return;
    const newRating = starIndex + 1;
    setCurrentRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleStarHover = (starIndex: number) => {
    if (!interactive) return;
    setHoveredRating(starIndex + 1);
  };

  const handleStarLeave = () => {
    if (!interactive) return;
    setHoveredRating(null);
  };

  const getStarFill = (starIndex: number) => {
    const displayRating = hoveredRating || currentRating;
    if (starIndex < Math.floor(displayRating)) {
      return 'full';
    } else if (starIndex === Math.floor(displayRating) && displayRating % 1 !== 0) {
      return 'half';
    } else {
      return 'empty';
    }
  };

  // Props para hover apenas no web
  const hoverProps = (index: number) => Platform.OS === 'web' ? {
    onMouseEnter: () => handleStarHover(index),
    onMouseLeave: handleStarLeave,
  } : {};

  const stars = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: maxRating }, (_, index) => {
        const fillType = getStarFill(index);
        const isHovered = hoveredRating && index < hoveredRating;
        if (interactive) {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => handleStarClick(index)}
              {...hoverProps(index)}
            >
              <StarIcon
                filled={fillType === 'full'}
                half={fillType === 'half'}
                size={size}
                glow={isHovered}
              />
            </TouchableOpacity>
          );
        } else if (onPress) {
          // Envolve cada estrela em TouchableWithoutFeedback para propagar o clique
          return (
            <TouchableWithoutFeedback key={index} onPress={onPress}>
              <View>
                <StarIcon
                  filled={fillType === 'full'}
                  half={fillType === 'half'}
                  size={size}
                />
              </View>
            </TouchableWithoutFeedback>
          );
        } else {
          return (
            <View key={index}>
              <StarIcon
                filled={fillType === 'full'}
                half={fillType === 'half'}
                size={size}
              />
            </View>
          );
        }
      })}
      {interactive && (
        <View style={{ marginLeft: 8 }}>
          <Text style={{ color: '#bbb', fontSize: 14 }}>{hoveredRating || currentRating}/5</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 8,
          backgroundColor: pressed ? 'rgba(24,24,27,0.92)' : 'transparent',
          padding: 2,
        }}
      >
        {stars}
      </TouchableOpacity>
    );
  }
  return stars;
};

export default StarRating;
