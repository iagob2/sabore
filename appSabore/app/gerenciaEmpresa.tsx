import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Dimensions, Alert, TouchableOpacity, TextInput, Modal, Switch, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { indexStyles } from '../style/indexStyles';
import { colors } from '../style/colors';
import Header from '../components/Header';
import ActionButton from '../components/ActionButton';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLargeScreen = SCREEN_WIDTH > 900;

const gerenciaEmpresaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.branco,
  },
  headerSection: {
    backgroundColor: colors.branco,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.verdeFolha,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  empresaTitle: {
    color: colors.verdeFolha,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  empresaSubtitle: {
    color: colors.marromFeijao,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.verdeFolha,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusText: {
    color: colors.branco,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: colors.branco,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.marromFeijao,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    color: colors.amareloOuro,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  gridContainer: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    flex: isLargeScreen ? 1 : undefined,
    minWidth: isLargeScreen ? 200 : undefined,
  },
  infoCard: {
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.marromFeijao,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    color: colors.verdeFolha,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    color: colors.preto,
    fontSize: 16,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: colors.verdeFolha,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: colors.branco,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: colors.verdeFolha,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.marromFeijao,
    fontSize: 12,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.marromFeijao,
    marginVertical: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.verdeFolha,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.branco,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.marromFeijao,
    fontSize: 16,
    color: colors.preto,
  },
  textArea: {
    backgroundColor: colors.branco,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.marromFeijao,
    fontSize: 16,
    color: colors.preto,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageUploadButton: {
    backgroundColor: colors.verdeFolha,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  imageUploadText: {
    color: colors.branco,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.branco,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.verdeFolha,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    color: colors.verdeFolha,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButtonCancel: {
    backgroundColor: colors.branco,
    borderWidth: 1.5,
    borderColor: colors.marromFeijao,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 6,
  },
  modalButtonSave: {
    backgroundColor: colors.verdeFolha,
    borderWidth: 1.5,
    borderColor: colors.verdeFolha,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginLeft: 6,
  },
  modalButtonText: {
    color: colors.verdeFolha,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Dados mockados da empresa (em um app real viriam de uma API)
const empresaData = {
  id: '1',
  nome: 'Sushi House',
  status: 'aberto',
  telefone: '(13) 3591-5817',
  endereco: 'Rua Japão, 123 - Centro, Santos/SP',
  email: 'contato@sushihouse.com.br',
  horario: 'Sextas e sábados: 16h às 23h30\nOutros dias: 16h às 22h30',
  lotacao: '6 mesas simultâneas',
  pratosCadastrados: 45,
  pedidosHoje: 23,
  avaliacaoMedia: 4.7,
  faturamentoMes: 'R$ 12.450,00',
  descricao: 'Restaurante especializado em culinária japonesa autêntica, oferecendo sushi, sashimi e pratos tradicionais com ingredientes frescos e de qualidade.',
  site: 'https://www.sushihouse.com.br',
  facebook: 'https://facebook.com/sushihouse',
  instagram: 'https://instagram.com/sushihouse',
  whatsapp: 'https://wa.me/551335915817',
  logotipo: null,
  banner: null,
  cardapio: null,
  rua: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  cnpj: '00.000.000/0000-00',
  aceitaComunicacao: false,
  aceitaMarketing: false,
  aceitaProtecaoDados: true,
};

const GerenciaEmpresa = () => {
  const { id } = useLocalSearchParams();
  const [empresa, setEmpresa] = useState(empresaData);

  // Adicionar estados para modal, campo em edição e dados temporários
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editData, setEditData] = useState<Partial<typeof empresaData>>({});

  const handleEditarDados = (field) => {
    setEditingField(field);
    setEditData({ ...empresa });
    setModalVisible(true);
  };

  const handleEditarHorario = () => {
    setEditingField('horario');
    setEditData({ ...empresa, horario: empresa.horario });
    setModalVisible(true);
  };

  const handleEditarDescricao = () => {
    setEditingField('descricao');
    setEditData({ ...empresa, descricao: empresa.descricao });
    setModalVisible(true);
  };

  const handleEditarRedesSociais = () => {
    setEditingField('redesSociais');
    setEditData({ ...empresa });
    setModalVisible(true);
  };

  const handleEditarImagens = () => {
    setEditingField('imagens');
    setEditData({ ...empresa });
    setModalVisible(true);
  };

  const handleEditarAutorizacoes = () => {
    setEditingField('autorizacoes');
    setEditData({
      aceitaComunicacao: empresa.aceitaComunicacao,
      aceitaMarketing: empresa.aceitaMarketing,
      aceitaProtecaoDados: empresa.aceitaProtecaoDados,
    });
    setModalVisible(true);
  };

  const handlePickLogotipo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditData({ ...editData, logotipo: result.assets[0] });
    }
  };

  const handlePickBanner = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditData({ ...editData, banner: result.assets[0] });
    }
  };

  const handlePickCardapio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result && result.assets && result.assets.length > 0) {
      setEditData({ ...editData, cardapio: result.assets[0] });
    }
  };

  const handleSaveChanges = () => {
    setEmpresa({ ...empresa, ...editData });
    setModalVisible(false);
    setEditingField('');
    setEditData({});
    Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
  };

  const handleGerenciarCardapio = () => {
    Alert.alert('Gerenciar Cardápio', 'Funcionalidade de gerenciamento de cardápio será implementada');
  };

  const handleGerenciarPromocoes = () => {
    Alert.alert('Gerenciar Promoções', 'Funcionalidade de promoções será implementada');
  };

  const handleRelatorios = () => {
    Alert.alert('Relatórios', 'Funcionalidade de relatórios será implementada');
  };

  const handleConfiguracoes = () => {
    Alert.alert('Configurações', 'Funcionalidade de configurações será implementada');
  };

  const handleAlterarStatus = () => {
    const novoStatus = empresa.status === 'aberto' ? 'fechado' : 'aberto';
    setEmpresa({ ...empresa, status: novoStatus });
    Alert.alert('Status Alterado', `Estabelecimento agora está ${novoStatus}`);
  };

  const renderModalContent = () => {
    switch (editingField) {
      case 'dadosBasicos':
        return (
          <>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Nome da Empresa</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.nome || ''}
                onChangeText={(text) => setEditData({ ...editData, nome: text })}
                placeholder="Digite o nome da empresa"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Telefone</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.telefone || ''}
                onChangeText={(text) => setEditData({ ...editData, telefone: text })}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>E-mail</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.email || ''}
                onChangeText={(text) => setEditData({ ...editData, email: text })}
                placeholder="contato@empresa.com"
                keyboardType="email-address"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Lotação</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.lotacao || ''}
                onChangeText={(text) => setEditData({ ...editData, lotacao: text })}
                placeholder="Ex: 6 mesas simultâneas"
              />
            </View>
          </>
        );
      case 'endereco':
        return (
          <>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Rua</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.rua || ''}
                onChangeText={(text) => setEditData({ ...editData, rua: text })}
                placeholder="Rua das Flores"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Bairro</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.bairro || ''}
                onChangeText={(text) => setEditData({ ...editData, bairro: text })}
                placeholder="Centro"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Cidade</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.cidade || ''}
                onChangeText={(text) => setEditData({ ...editData, cidade: text })}
                placeholder="Santos"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Estado</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.estado || ''}
                onChangeText={(text) => setEditData({ ...editData, estado: text })}
                placeholder="SP"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>CEP</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.cep || ''}
                onChangeText={(text) => setEditData({ ...editData, cep: text })}
                placeholder="00000-000"
                keyboardType="numeric"
              />
            </View>
          </>
        );
      case 'horario':
        return (
          <View style={gerenciaEmpresaStyles.inputContainer}>
            <Text style={gerenciaEmpresaStyles.inputLabel}>Horário de Funcionamento</Text>
            <TextInput
              style={gerenciaEmpresaStyles.textArea}
              value={editData.horario || ''}
              onChangeText={(text) => setEditData({ ...editData, horario: text })}
              placeholder="Ex: Seg-Sex: 18h-23h\nSáb-Dom: 17h-00h"
              multiline
            />
          </View>
        );
      case 'descricao':
        return (
          <View style={gerenciaEmpresaStyles.inputContainer}>
            <Text style={gerenciaEmpresaStyles.inputLabel}>Descrição da Empresa</Text>
            <TextInput
              style={gerenciaEmpresaStyles.textArea}
              value={editData.descricao || ''}
              onChangeText={(text) => setEditData({ ...editData, descricao: text })}
              placeholder="Descreva seu estabelecimento..."
              multiline
            />
          </View>
        );
      case 'redesSociais':
        return (
          <>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Site</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.site || ''}
                onChangeText={(text) => setEditData({ ...editData, site: text })}
                placeholder="https://www.seusite.com"
                keyboardType="url"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Facebook</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.facebook || ''}
                onChangeText={(text) => setEditData({ ...editData, facebook: text })}
                placeholder="https://facebook.com/suaempresa"
                keyboardType="url"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Instagram</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.instagram || ''}
                onChangeText={(text) => setEditData({ ...editData, instagram: text })}
                placeholder="https://instagram.com/suaempresa"
                keyboardType="url"
              />
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>WhatsApp</Text>
              <TextInput
                style={gerenciaEmpresaStyles.input}
                value={editData.whatsapp || ''}
                onChangeText={(text) => setEditData({ ...editData, whatsapp: text })}
                placeholder="https://wa.me/5511999999999"
                keyboardType="url"
              />
            </View>
          </>
        );
      case 'imagens':
        return (
          <>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Logotipo</Text>
              <TouchableOpacity onPress={handlePickLogotipo} style={gerenciaEmpresaStyles.imageUploadButton}>
                <Text style={gerenciaEmpresaStyles.imageUploadText}>
                  {editData.logotipo ? '✓ Logotipo Selecionado' : '🖼️ Selecionar Logotipo'}
                </Text>
              </TouchableOpacity>
              {editData.logotipo && (
                <Text style={{ color: colors.preto, fontSize: 12, marginTop: 4 }}>
                  {editData.logotipo.fileName || 'Logotipo selecionado'}
                </Text>
              )}
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Banner</Text>
              <TouchableOpacity onPress={handlePickBanner} style={gerenciaEmpresaStyles.imageUploadButton}>
                <Text style={gerenciaEmpresaStyles.imageUploadText}>
                  {editData.banner ? '✓ Banner Selecionado' : '🖼️ Selecionar Banner'}
                </Text>
              </TouchableOpacity>
              {editData.banner && (
                <Text style={{ color: colors.preto, fontSize: 12, marginTop: 4 }}>
                  {editData.banner.fileName || 'Banner selecionado'}
                </Text>
              )}
            </View>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Cardápio (PDF)</Text>
              <TouchableOpacity onPress={handlePickCardapio} style={gerenciaEmpresaStyles.imageUploadButton}>
                <Text style={gerenciaEmpresaStyles.imageUploadText}>
                  {editData.cardapio ? `✓ ${editData.cardapio.name}` : '📎 Selecionar Cardápio (PDF)'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 'autorizacoes':
        return (
          <>
            <View style={gerenciaEmpresaStyles.inputContainer}>
              <Text style={gerenciaEmpresaStyles.inputLabel}>Autorizações</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Switch
                  value={editData.aceitaComunicacao}
                  onValueChange={v => setEditData({ ...editData, aceitaComunicacao: v })}
                  trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                  thumbColor={editData.aceitaComunicacao ? colors.branco : '#f4f3f4'}
                />
                <Text style={{ color: colors.preto, fontSize: 14, marginLeft: 12, flex: 1 }}>
                  Autorizo o uso do e-mail e telefone para comunicação sobre pedidos
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Switch
                  value={editData.aceitaMarketing}
                  onValueChange={v => setEditData({ ...editData, aceitaMarketing: v })}
                  trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                  thumbColor={editData.aceitaMarketing ? colors.branco : '#f4f3f4'}
                />
                <Text style={{ color: colors.preto, fontSize: 14, marginLeft: 12, flex: 1 }}>
                  Aceito receber ofertas e novidades por e-mail
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Switch
                  value={editData.aceitaProtecaoDados}
                  onValueChange={v => setEditData({ ...editData, aceitaProtecaoDados: v })}
                  trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                  thumbColor={editData.aceitaProtecaoDados ? colors.branco : '#f4f3f4'}
                />
                <Text style={{ color: colors.preto, fontSize: 14, marginLeft: 12, flex: 1 }}>
                  Li e aceito a política de proteção de dados
                </Text>
              </View>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (editingField) {
      case 'dadosBasicos':
        return 'Editar Dados Básicos';
      case 'endereco':
        return 'Editar Endereço';
      case 'horario':
        return 'Editar Horário';
      case 'descricao':
        return 'Editar Descrição';
      case 'redesSociais':
        return 'Editar Redes Sociais';
      case 'imagens':
        return 'Editar Imagens';
      case 'autorizacoes':
        return 'Editar Autorizações';
      default:
        return 'Editar';
    }
  };

  return (
    <View style={gerenciaEmpresaStyles.container}>
      <Header logo="Gerenciamento" />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header da Empresa */}
        <View style={gerenciaEmpresaStyles.headerSection}>
          <Text style={gerenciaEmpresaStyles.empresaTitle}>{empresa.nome}</Text>
          <Text style={gerenciaEmpresaStyles.empresaSubtitle}>Painel de Controle</Text>
          <View style={gerenciaEmpresaStyles.statusIndicator}>
            <Text style={{ fontSize: 16 }}>
              {empresa.status === 'aberto' ? '🟢' : '🔴'}
            </Text>
            <Text style={gerenciaEmpresaStyles.statusText}>
              {empresa.status === 'aberto' ? 'Aberto' : 'Fechado'}
            </Text>
          </View>
        </View>

        {/* Estatísticas Rápidas */}
        <View style={gerenciaEmpresaStyles.section}>
          <Text style={gerenciaEmpresaStyles.sectionTitle}>
            <Text style={gerenciaEmpresaStyles.sectionIcon}>📊</Text>
            Estatísticas do Dia
          </Text>
          <View style={gerenciaEmpresaStyles.statsContainer}>
            <View style={gerenciaEmpresaStyles.statItem}>
              <Text style={gerenciaEmpresaStyles.statNumber}>{empresa.pedidosHoje}</Text>
              <Text style={gerenciaEmpresaStyles.statLabel}>Pedidos Hoje</Text>
            </View>
            <View style={gerenciaEmpresaStyles.statItem}>
              <Text style={gerenciaEmpresaStyles.statNumber}>{empresa.pratosCadastrados}</Text>
              <Text style={gerenciaEmpresaStyles.statLabel}>Pratos Cadastrados</Text>
            </View>
            <View style={gerenciaEmpresaStyles.statItem}>
              <Text style={gerenciaEmpresaStyles.statNumber}>{empresa.avaliacaoMedia}</Text>
              <Text style={gerenciaEmpresaStyles.statLabel}>Avaliação Média</Text>
            </View>
          </View>
        </View>

        {/* Ações Principais */}
        <View style={gerenciaEmpresaStyles.section}>
          <Text style={gerenciaEmpresaStyles.sectionTitle}>
            <Text style={gerenciaEmpresaStyles.sectionIcon}>⚡</Text>
            Ações Rápidas
          </Text>
          <View style={gerenciaEmpresaStyles.gridContainer}>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <ActionButton
                text="Alterar Status"
                icon={empresa.status === 'aberto' ? '🔴' : '🟢'}
                onPress={handleAlterarStatus}
                variant="primary"
              />
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <ActionButton
                text="Gerenciar Cardápio"
                icon="🍣"
                onPress={handleGerenciarCardapio}
                variant="primary"
              />
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <ActionButton
                text="Promoções"
                icon="🔥"
                onPress={handleGerenciarPromocoes}
                variant="secondary"
              />
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <ActionButton
                text="Relatórios"
                icon="📈"
                onPress={handleRelatorios}
                variant="secondary"
              />
            </View>
          </View>
        </View>

        {/* Informações da Empresa */}
        <View style={gerenciaEmpresaStyles.section}>
          <Text style={gerenciaEmpresaStyles.sectionTitle}>
            <Text style={gerenciaEmpresaStyles.sectionIcon}>🏢</Text>
            Informações da Empresa
          </Text>
          <View style={gerenciaEmpresaStyles.gridContainer}>
            {/* CNPJ apenas visualização */}
            <View style={gerenciaEmpresaStyles.gridItem}>
              <View style={gerenciaEmpresaStyles.infoCard}>
                <Text style={gerenciaEmpresaStyles.infoLabel}>CNPJ</Text>
                <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.cnpj}</Text>
              </View>
            </View>
            {/* Card de Logo e Banner */}
            <View style={gerenciaEmpresaStyles.gridItem}>
              <View style={gerenciaEmpresaStyles.infoCard}>
                <Text style={gerenciaEmpresaStyles.infoLabel}>Logo</Text>
                {empresa.logotipo ? (
                  <View style={{ alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 60, height: 60, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: colors.verdeFolha }}>
                      <Image source={{ uri: empresa.logotipo.uri || empresa.logotipo }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                    </View>
                  </View>
                ) : (
                  <Text style={{ color: colors.marromFeijao, fontSize: 12, marginBottom: 8 }}>Nenhum logo cadastrado</Text>
                )}
                <Text style={gerenciaEmpresaStyles.infoLabel}>Banner</Text>
                {empresa.banner ? (
                  <View style={{ alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 120, height: 40, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: colors.verdeFolha }}>
                      <Image source={{ uri: empresa.banner.uri || empresa.banner }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                    </View>
                  </View>
                ) : (
                  <Text style={{ color: colors.marromFeijao, fontSize: 12, marginBottom: 8 }}>Nenhum banner cadastrado</Text>
                )}
                <TouchableOpacity style={gerenciaEmpresaStyles.editButton} onPress={handleEditarImagens}>
                  <Text style={gerenciaEmpresaStyles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <View style={gerenciaEmpresaStyles.infoCard}>
                <Text style={gerenciaEmpresaStyles.infoLabel}>Telefone</Text>
                <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.telefone}</Text>
                <TouchableOpacity style={gerenciaEmpresaStyles.editButton} onPress={() => handleEditarDados('dadosBasicos')}>
                  <Text style={gerenciaEmpresaStyles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <View style={gerenciaEmpresaStyles.infoCard}>
                <Text style={gerenciaEmpresaStyles.infoLabel}>Endereço</Text>
                <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.endereco}</Text>
                <TouchableOpacity style={gerenciaEmpresaStyles.editButton} onPress={() => handleEditarDados('endereco')}>
                  <Text style={gerenciaEmpresaStyles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <View style={gerenciaEmpresaStyles.infoCard}>
                <Text style={gerenciaEmpresaStyles.infoLabel}>E-mail</Text>
                <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.email}</Text>
                <TouchableOpacity style={gerenciaEmpresaStyles.editButton} onPress={() => handleEditarDados('dadosBasicos')}>
                  <Text style={gerenciaEmpresaStyles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <View style={gerenciaEmpresaStyles.infoCard}>
                <Text style={gerenciaEmpresaStyles.infoLabel}>Lotação</Text>
                <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.lotacao}</Text>
                <TouchableOpacity style={gerenciaEmpresaStyles.editButton} onPress={() => handleEditarDados('dadosBasicos')}>
                  <Text style={gerenciaEmpresaStyles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Horário de Funcionamento */}
        <View style={gerenciaEmpresaStyles.section}>
          <Text style={gerenciaEmpresaStyles.sectionTitle}>
            <Text style={gerenciaEmpresaStyles.sectionIcon}>⏰</Text>
            Horário de Funcionamento
          </Text>
          <View style={gerenciaEmpresaStyles.infoCard}>
            <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.horario}</Text>
            <ActionButton
              text="Editar Horário"
              icon="✏️"
              onPress={handleEditarHorario}
              variant="secondary"
              style={{ marginTop: 12 }}
            />
          </View>
        </View>

        {/* Faturamento */}
        <View style={gerenciaEmpresaStyles.section}>
          <Text style={gerenciaEmpresaStyles.sectionTitle}>
            <Text style={gerenciaEmpresaStyles.sectionIcon}>💰</Text>
            Faturamento do Mês
          </Text>
          <View style={gerenciaEmpresaStyles.infoCard}>
            <Text style={[gerenciaEmpresaStyles.infoValue, { fontSize: 24, color: colors.verdeFolha }]}>
              {empresa.faturamentoMes}
            </Text>
            <ActionButton
              text="Ver Detalhes"
              icon="📊"
              onPress={handleRelatorios}
              variant="primary"
              style={{ marginTop: 12 }}
            />
          </View>
        </View>

        {/* Configurações Avançadas */}
        <View style={gerenciaEmpresaStyles.section}>
          <Text style={gerenciaEmpresaStyles.sectionTitle}>
            <Text style={gerenciaEmpresaStyles.sectionIcon}>⚙️</Text>
            Configurações
          </Text>
          <View style={gerenciaEmpresaStyles.gridContainer}>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <ActionButton
                text="Configurações Gerais"
                icon="🔧"
                onPress={handleConfiguracoes}
                variant="secondary"
              />
            </View>
            <View style={gerenciaEmpresaStyles.gridItem}>
              <ActionButton
                text="Backup de Dados"
                icon="💾"
                onPress={() => Alert.alert('Backup', 'Funcionalidade de backup será implementada')}
                variant="secondary"
              />
            </View>
          </View>
        </View>

        {/* Seção de autorizações */}
        <View style={gerenciaEmpresaStyles.section}>
          <Text style={gerenciaEmpresaStyles.sectionTitle}>
            <Text style={gerenciaEmpresaStyles.sectionIcon}>🔒</Text>
            Autorizações
          </Text>
          <View style={gerenciaEmpresaStyles.infoCard}>
            <Text style={gerenciaEmpresaStyles.infoLabel}>Comunicação</Text>
            <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.aceitaComunicacao ? 'Autorizado' : 'Não autorizado'}</Text>
            <Text style={gerenciaEmpresaStyles.infoLabel}>Marketing</Text>
            <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.aceitaMarketing ? 'Aceito' : 'Não aceito'}</Text>
            <Text style={gerenciaEmpresaStyles.infoLabel}>Proteção de Dados</Text>
            <Text style={gerenciaEmpresaStyles.infoValue}>{empresa.aceitaProtecaoDados ? 'Aceito' : 'Não aceito'}</Text>
            <TouchableOpacity style={gerenciaEmpresaStyles.editButton} onPress={handleEditarAutorizacoes}>
              <Text style={gerenciaEmpresaStyles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
            {renderModalContent()}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonSave} onPress={handleSaveChanges}>
                <Text style={styles.modalButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GerenciaEmpresa;
