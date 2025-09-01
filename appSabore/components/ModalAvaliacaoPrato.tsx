import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import { colors } from '../style/colors';
import StarRating from './StarRating';
import { criarAvaliacaoPrato, AvaliacaoPratoRequest } from '../api/avaliacaoPrato';

interface ModalAvaliacaoPratoProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  prato: {
    id: number;
    nome: string;
    preco: number;
    imagemUrl?: string;
  };
}

const ModalAvaliacaoPrato: React.FC<ModalAvaliacaoPratoProps> = ({
  visible,
  onClose,
  onSuccess,
  prato
}) => {
  const [nota, setNota] = useState<number>(5);
  const [comentario, setComentario] = useState<string>('');
  const [enviando, setEnviando] = useState<boolean>(false);

  const resetarFormulario = () => {
    setNota(5);
    setComentario('');
  };

  const fecharModal = () => {
    resetarFormulario();
    onClose();
  };

  const enviarAvaliacao = async () => {
    if (nota < 1 || nota > 5) {
      Alert.alert('Erro', 'A nota deve estar entre 1 e 5 estrelas.');
      return;
    }

    if (comentario.length > 500) {
      Alert.alert('Erro', 'O comentário deve ter no máximo 500 caracteres.');
      return;
    }

    setEnviando(true);

    try {
      const avaliacaoData: AvaliacaoPratoRequest = {
        nota,
        comentario: comentario.trim() || undefined,
        prato: {
          id: prato.id
        }
      };

      await criarAvaliacaoPrato(avaliacaoData);

      // Chamar onSuccess imediatamente após o sucesso
      onSuccess?.();
      
      // Fechar modal
      fecharModal();
      
      // Mostrar alert de sucesso (opcional)
      Alert.alert(
        'Sucesso!',
        'Sua avaliação foi enviada com sucesso.'
      );
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Não foi possível enviar a avaliação. Tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const pratoImage = prato.imagemUrl 
    ? { uri: prato.imagemUrl } 
    : require('../assets/pratos/prato1.png');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={fecharModal}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <Text style={styles.titulo}>Avalie este prato</Text>

            {/* Informações do Prato */}
            <View style={styles.pratoInfo}>
              <Image source={pratoImage} style={styles.pratoImagem} />
              <View style={styles.pratoTexto}>
                <Text style={styles.pratoNome}>{prato.nome}</Text>
                <Text style={styles.pratoPreco}>
                  R$ {prato.preco.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>

            {/* Rating com Estrelas */}
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Sua nota:</Text>
              <StarRating
                rating={nota}
                interactive
                onRatingChange={setNota}
                size={36}
              />
            </View>

            {/* Campo de Comentário */}
            <View style={styles.comentarioContainer}>
              <Text style={styles.comentarioLabel}>
                Comentário (opcional)
              </Text>
              <TextInput
                style={styles.comentarioInput}
                placeholder="Conte-nos sobre sua experiência com este prato..."
                placeholderTextColor={colors.preto + '88'}
                multiline
                numberOfLines={4}
                maxLength={500}
                value={comentario}
                onChangeText={setComentario}
                textAlignVertical="top"
              />
              <Text style={styles.contadorCaracteres}>
                {comentario.length}/500
              </Text>
            </View>

            {/* Botões */}
            <View style={styles.botoesContainer}>
              <TouchableOpacity
                style={[styles.botao, styles.botaoCancelar]}
                onPress={fecharModal}
                disabled={enviando}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botao, styles.botaoEnviar]}
                onPress={enviarAvaliacao}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator size="small" color={colors.branco} />
                ) : (
                  <Text style={styles.textoBotaoEnviar}>Enviar Avaliação</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.branco,
    borderRadius: 20,
    width: '100%',
    maxWidth: 450,
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: colors.verdeFolha,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  scrollContent: {
    padding: 28,
  },
  titulo: {
    color: colors.verdeFolha,
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  pratoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.verdeFolha + '30',
  },
  pratoImagem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  pratoTexto: {
    flex: 1,
  },
  pratoNome: {
    color: colors.marromFeijao,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  pratoPreco: {
    color: colors.amareloOuro,
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingLabel: {
    color: colors.marromFeijao,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  comentarioContainer: {
    marginBottom: 24,
  },
  comentarioLabel: {
    color: colors.marromFeijao,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  comentarioInput: {
    backgroundColor: colors.branco,
    color: colors.preto,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: colors.verdeFolha,
    minHeight: 100,
  },
  contadorCaracteres: {
    color: colors.preto + '88',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  botao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  botaoCancelar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.vermelhoCambuci,
  },
  botaoEnviar: {
    backgroundColor: colors.verdeFolha,
  },
  textoBotaoCancelar: {
    color: colors.vermelhoCambuci,
    fontSize: 16,
    fontWeight: '600',
  },
  textoBotaoEnviar: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModalAvaliacaoPrato;
