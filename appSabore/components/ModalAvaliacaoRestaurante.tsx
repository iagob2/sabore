import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  useWindowDimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { colors } from '../style/colors';
import StarRating from './StarRating';
import { criarAvaliacaoRestaurante, AvaliacaoRestauranteCreate } from '../api/avaliacaoRestaurante';

interface ModalAvaliacaoRestauranteProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  restaurante: {
    id: number;
    nome: string;
    logoUrl?: string;
    descricao?: string;
  };
}

const ModalAvaliacaoRestaurante: React.FC<ModalAvaliacaoRestauranteProps> = ({
  visible,
  onClose,
  onSuccess,
  restaurante,
}) => {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width <= 380;
  const isTablet = width >= 768;
  const isShortScreen = height <= 680;

  const handleSubmit = async () => {
    if (nota === 0) {
      Alert.alert('Atenção', 'Por favor, selecione uma nota para o restaurante.');
      return;
    }

    if (nota < 1 || nota > 5) {
      Alert.alert('Erro', 'A nota deve ser entre 1 e 5 estrelas.');
      return;
    }

    try {
      setLoading(true);
      console.log('🏪 === ENVIANDO AVALIAÇÃO DO RESTAURANTE ===');
      console.log('📊 Dados:', { nota, comentario, restauranteId: restaurante.id });

      const avaliacaoData: AvaliacaoRestauranteCreate = {
        nota,
        comentario: comentario.trim() || undefined,
        restaurante: {
          id: restaurante.id,
        },
      };

      await criarAvaliacaoRestaurante(avaliacaoData);
      
      console.log('✅ Avaliação do restaurante enviada com sucesso!');
      
      // Limpar formulário
      setNota(0);
      setComentario('');
      
      // Fechar modal e chamar callback de sucesso
      onClose();
      onSuccess();
      
    } catch (error) {
      console.error('❌ Erro ao enviar avaliação do restaurante:', error);
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Não foi possível enviar a avaliação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    
    // Limpar formulário ao fechar
    setNota(0);
    setComentario('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
            style={[
              styles.modalContainer,
              (isSmallScreen || !isTablet) && styles.modalContainerMobile,
              isShortScreen && styles.modalContainerShort
            ]}
          >
          <ScrollView 
            contentContainerStyle={[
              styles.scrollContent,
              (isSmallScreen || !isTablet) && styles.scrollContentMobile
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={[
              styles.header,
              (isSmallScreen || !isTablet) && styles.headerMobile
            ]}>
              <Text style={[
                styles.title,
                (isSmallScreen || !isTablet) && styles.titleMobile
              ]}>
                ⭐ Avaliar Restaurante
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={[
                  styles.closeButton,
                  (isSmallScreen || !isTablet) && styles.closeButtonMobile
                ]}
                accessibilityLabel="Fechar modal de avaliação"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Informações do Restaurante */}
            <View style={[
              styles.restauranteInfo,
              (isSmallScreen || !isTablet) && styles.restauranteInfoMobile
            ]}>
              <View style={[
                styles.restauranteHeader,
                isSmallScreen && styles.restauranteHeaderMobile
              ]}>
                {restaurante.logoUrl ? (
                  <Image 
                    source={{ uri: restaurante.logoUrl }} 
                    style={styles.logo}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.logo, styles.logoPlaceholder]}>
                    <Text style={styles.logoText}>🏪</Text>
                  </View>
                )}
                <View style={[
                  styles.restauranteDetails,
                  isSmallScreen && styles.restauranteDetailsMobile
                ]}>
                  <Text style={[
                    styles.restauranteNome,
                    isSmallScreen && styles.restauranteNomeMobile
                  ]}>
                    {restaurante.nome}
                  </Text>
                  {restaurante.descricao && (
                    <Text style={[
                      styles.restauranteDescricao,
                      isSmallScreen && styles.restauranteDescricaoMobile
                    ]}>
                      {restaurante.descricao}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Avaliação por Estrelas */}
            <View style={styles.ratingSection}>
              <Text style={[
                styles.sectionTitle,
                (isSmallScreen || !isTablet) && styles.sectionTitleMobile
              ]}>
                Como foi sua experiência?
              </Text>
              <View style={styles.starContainer}>
                <StarRating
                  rating={nota}
                  onRatingChange={setNota}
                  size={isSmallScreen ? 32 : 40}
                  interactive={true}
                />
              </View>
              <Text style={styles.ratingText}>
                {nota === 0 && 'Toque nas estrelas para avaliar'}
                {nota === 1 && '😞 Muito ruim'}
                {nota === 2 && '😕 Ruim'}
                {nota === 3 && '😐 Regular'}
                {nota === 4 && '😊 Bom'}
                {nota === 5 && '🤩 Excelente!'}
              </Text>
            </View>

            {/* Comentário */}
            <View style={styles.commentSection}>
              <Text style={styles.sectionTitle}>
                Comentário (opcional)
              </Text>
              <TextInput
                style={[
                  styles.commentInput,
                  (isSmallScreen || !isTablet) && styles.commentInputMobile
                ]}
                value={comentario}
                onChangeText={setComentario}
                placeholder="Conte-nos mais sobre sua experiência..."
                placeholderTextColor={colors.cinzaMedio}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {comentario.length}/500 caracteres
              </Text>
            </View>

            {/* Botões */}
            <View style={[
              styles.buttonContainer,
              (isSmallScreen || !isTablet) && styles.buttonContainerMobile
            ]}>
              <TouchableOpacity
                onPress={handleClose}
                style={[
                  styles.button,
                  styles.cancelButton,
                  (isSmallScreen || !isTablet) && styles.buttonMobile
                ]}
                disabled={loading}
              >
                <Text style={[
                  styles.cancelButtonText,
                  (isSmallScreen || !isTablet) && styles.buttonTextMobile
                ]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.button,
                  styles.submitButton,
                  (isSmallScreen || !isTablet) && styles.buttonMobile,
                  (nota === 0 || loading) && styles.submitButtonDisabled
                ]}
                disabled={nota === 0 || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.branco} />
                ) : (
                  <Text style={[
                    styles.submitButtonText,
                    (isSmallScreen || !isTablet) && styles.buttonTextMobile
                  ]}>
                    Enviar Avaliação
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardAvoiding: {
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.branco,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalContainerMobile: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
  },
  modalContainerShort: {
    maxHeight: '85%',
  },
  scrollContent: {
    padding: 24,
  },
  scrollContentMobile: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.verdeFolha,
  },
  headerMobile: {
    marginBottom: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.verdeFolha,
    flex: 1,
  },
  titleMobile: {
    fontSize: 20,
    lineHeight: 24,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.cinzaMuitoClaro,
  },
  closeButtonMobile: {
    padding: 6,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.cinzaEscuro,
    fontWeight: 'bold',
  },
  restauranteInfo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.verdeFolha + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.verdeFolha + '30',
  },
  restauranteInfoMobile: {
    padding: 14,
    marginBottom: 20,
  },
  restauranteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restauranteHeaderMobile: {
    alignItems: 'flex-start',
    gap: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  logoPlaceholder: {
    backgroundColor: colors.verdeFolha,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  restauranteDetails: {
    flex: 1,
  },
  restauranteDetailsMobile: {
    marginRight: 8,
  },
  restauranteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.verdeFolha,
    marginBottom: 4,
  },
  restauranteNomeMobile: {
    fontSize: 16,
    lineHeight: 20,
  },
  restauranteDescricao: {
    fontSize: 14,
    color: colors.cinzaEscuro,
    lineHeight: 20,
  },
  restauranteDescricaoMobile: {
    fontSize: 13,
    lineHeight: 18,
  },
  ratingSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.verdeFolha,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitleMobile: {
    fontSize: 16,
    marginBottom: 12,
  },
  starContainer: {
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    color: colors.marromFeijao,
    fontWeight: '600',
    textAlign: 'center',
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.verdeFolha,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.preto,
    backgroundColor: colors.branco,
    minHeight: 100,
    marginBottom: 8,
  },
  commentInputMobile: {
    padding: 14,
    minHeight: 90,
    fontSize: 15,
  },
  characterCount: {
    fontSize: 12,
    color: colors.cinzaMedio,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContainerMobile: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButton: {
    backgroundColor: colors.branco,
    borderWidth: 2,
    borderColor: colors.cinzaMedio,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.cinzaEscuro,
  },
  buttonMobile: {
    width: '100%',
    alignSelf: 'stretch',
    paddingVertical: 14,
  },
  submitButton: {
    backgroundColor: colors.verdeFolha,
    borderWidth: 2,
    borderColor: colors.verdeFolha,
  },
  submitButtonDisabled: {
    backgroundColor: colors.cinzaClaro,
    borderColor: colors.cinzaClaro,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.branco,
  },
  buttonTextMobile: {
    fontSize: 15,
  },
});

export default ModalAvaliacaoRestaurante;
