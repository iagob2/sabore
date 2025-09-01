import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import StarRating from './StarRating';
import { colors } from '../style/colors';

interface CardPratoProps {
  imagem: any;
  nome: string;
  ingredientes: string;
  valor: string;
  avaliacao: number;
  onPress?: () => void;
  onPressAvaliacoes?: () => void;
  itemId?: number;
}

const CardPrato: React.FC<CardPratoProps> = ({ imagem, nome, ingredientes, valor, avaliacao, onPress, onPressAvaliacoes }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Props para hover apenas no web
  const hoverProps = Platform.OS === 'web' ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isHovered && styles.cardHovered
      ]} 
      onPress={onPress} 
      activeOpacity={0.85}
      {...hoverProps}
    >
      <Image source={imagem} style={styles.imagem} />
      <View style={styles.info}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.ingredientes} numberOfLines={2}>{ingredientes}</Text>
        <View style={styles.row}>
          <Text style={styles.valor}>{valor}</Text>
          <StarRating 
            rating={avaliacao} 
            size={16} 
            onPress={onPressAvaliacoes}
          />
        </View>
      </View>
      <View style={[styles.borderGlow, isHovered && styles.borderGlowHovered]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.branco, // era #F5F5F3
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
    marginHorizontal: 8,
    width: 220,
    height: 280, // Altura fixa para padronizar
    elevation: 2,
    shadowColor: colors.marromFeijao, // era #650C0C
    shadowOpacity: 0.10,
    shadowRadius: 6,
    position: 'relative',
  },
  cardHovered: {
    transform: [{ scale: 1.05 }],
    shadowColor: colors.amareloOuro, // era #650C0C
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  imagem: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  nome: {
    color: colors.verdeFolha, // era #650C0C
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 4,
  },
  ingredientes: {
    color: colors.preto, // era #0B0B0B
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
    flex: 1,
  },
  valor: {
    color: colors.preto, // era #0B0B0B
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.verdeFolha + '20', // verde-folha com opacidade
    zIndex: 4,
  },
  borderGlowHovered: {
    borderColor: colors.verdeFolha, // verde-folha
    borderWidth: 2,
  },
});

export default CardPrato; 