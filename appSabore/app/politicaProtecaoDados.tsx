import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions, useWindowDimensions, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../style/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLargeScreen = SCREEN_WIDTH > 900;

const politicaStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.branco,
    borderRadius: 20,
    width: '100%',
    maxWidth: isLargeScreen ? 800 : 600,
    maxHeight: '90%',
    padding: 24,
    borderWidth: 2,
    borderColor: colors.verdeFolha,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  modalContentMobile: {
    maxWidth: 420,
    padding: 20,
    borderRadius: 16,
  },
  modalContentShort: {
    maxHeight: '85%',
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
    color: colors.verdeFolha,
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  titleMobile: {
    fontSize: 20,
    lineHeight: 24,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonMobile: {
    padding: 6,
  },
  content: {
    flex: 1,
  },
  contentContainerMobile: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.amareloOuro,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitleMobile: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: colors.verdeFolha,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionSubtitleMobile: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  text: {
    color: colors.preto,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  textMobile: {
    fontSize: 13,
    lineHeight: 18,
  },
  listItem: {
    color: colors.preto,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    paddingLeft: 16,
  },
  listItemMobile: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    paddingLeft: 12,
  },
  highlight: {
    backgroundColor: colors.verdeFolha,
    color: colors.branco,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.verdeFolha,
  },
  footerText: {
    color: colors.marromFeijao,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footerTextMobile: {
    fontSize: 11,
  },
});

interface PoliticaProtecaoDadosProps {
  visible: boolean;
  onClose: () => void;
  tipo: 'usuario' | 'empresa';
}

const PoliticaProtecaoDados = ({ visible, onClose, tipo }: PoliticaProtecaoDadosProps) => {
  const isEmpresa = tipo === 'empresa';
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width <= 420;
  const isTablet = width >= 768;
  const isShortScreen = height <= 700;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={politicaStyles.safeArea}>
        <View style={politicaStyles.modalContainer}>
        <View
          style={[
            politicaStyles.modalContent,
            (isSmallScreen || !isTablet) && politicaStyles.modalContentMobile,
            isShortScreen && politicaStyles.modalContentShort,
          ]}
        >
          <View
            style={[
              politicaStyles.header,
              (isSmallScreen || !isTablet) && politicaStyles.headerMobile,
            ]}
          >
            <Text
              style={[
                politicaStyles.title,
                (isSmallScreen || !isTablet) && politicaStyles.titleMobile,
              ]}
            >
              Política de Proteção de Dados
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                politicaStyles.closeButton,
                (isSmallScreen || !isTablet) && politicaStyles.closeButtonMobile,
              ]}
              accessibilityLabel="Fechar política de proteção de dados"
            >
              <FontAwesome name="times" size={24} color={colors.verdeFolha} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={politicaStyles.content}
            contentContainerStyle={(isSmallScreen || !isTablet) ? politicaStyles.contentContainerMobile : undefined}
            showsVerticalScrollIndicator={false}
          >
            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>1. Introdução</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Esta Política de Proteção de Dados ("Política") descreve como o Saborê coleta, usa, armazena e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais legislações aplicáveis.
              </Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>2. Dados Coletados</Text>
              
              <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Para {isEmpresa ? 'Empresas' : 'Usuários'}:</Text>
              {isEmpresa ? (
                <>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Nome da empresa e CNPJ</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Telefone e e-mail de contato</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Endereço completo</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Descrição do estabelecimento</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Horário de funcionamento</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Links de redes sociais</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Cardápio em formato PDF</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Imagens do estabelecimento e pratos</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Dados de faturamento e pedidos</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Avaliações e feedback dos clientes</Text>
                </>
              ) : (
                <>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Nome completo e CPF</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Telefone e e-mail</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Histórico de pedidos</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Preferências de restaurantes</Text>
                  <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Avaliações e comentários</Text>
                </>
              )}
            </View>

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>2.1. Dados NÃO Coletados de Empresas</Text>
                <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                  Para proteger a privacidade e segurança, NÃO coletamos:
                </Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Dados pessoais dos funcionários (CPF, RG, etc.)</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Informações bancárias detalhadas</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Documentos fiscais internos</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Estratégias comerciais confidenciais</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Dados de fornecedores terceiros</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Informações de concorrentes</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Dados pessoais de clientes (apenas dados agregados)</Text>
              </View>
            )}

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>2.2. Diferenciação: Dados de Empresa vs. Dados de Usuário</Text>
                <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                  É importante entender que empresas e usuários têm perfis e responsabilidades diferentes:
                </Text>
                
                <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Dados de Empresa (Públicos):</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Visibilidade:</Text> Informações visíveis a todos os usuários</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Propósito:</Text> Facilitar escolhas e pedidos dos clientes</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Responsabilidade:</Text> Empresa é responsável pela precisão</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Controle:</Text> Empresa pode editar e atualizar</Text>
                
                <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Dados de Usuário (Privados):</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Visibilidade:</Text> Apenas para o próprio usuário e plataforma</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Propósito:</Text> Funcionamento do aplicativo e histórico pessoal</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Responsabilidade:</Text> Plataforma protege e gerencia</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Controle:</Text> Usuário pode excluir ou modificar</Text>
                
                <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                  <Text style={politicaStyles.highlight}>Importante:</Text> Empresas não têm acesso a dados pessoais de usuários individuais, apenas a dados agregados para fins de análise de negócio.
                </Text>
              </View>
            )}

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>3. Finalidades do Tratamento</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Seus dados pessoais são utilizados para as seguintes finalidades:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Prestação dos serviços do aplicativo</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Processamento de pedidos e pagamentos</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Comunicação sobre pedidos e status</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Melhoria da experiência do usuário</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Suporte ao cliente</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Marketing (apenas com consentimento)</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>4. Base Legal</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                O tratamento de seus dados é baseado nas seguintes hipóteses legais da LGPD:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Consentimento:</Text> Para marketing e comunicações promocionais</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Execução de contrato:</Text> Para prestação dos serviços</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Legítimo interesse:</Text> Para melhorias e segurança</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Cumprimento de obrigação legal:</Text> Para fins fiscais e regulatórios</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>5. Compartilhamento de Dados</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Seus dados podem ser compartilhados com:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Restaurantes para processamento de pedidos</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Prestadores de serviços de pagamento</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Serviços de entrega</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Autoridades competentes (quando exigido por lei)</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>6. Segurança dos Dados</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Acesso não autorizado</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Alteração, divulgação ou destruição não autorizada</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Perda acidental</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Processamento ilegal</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>7. Seus Direitos</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Conforme a LGPD, você tem os seguintes direitos:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Acesso:</Text> Solicitar informações sobre seus dados</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Correção:</Text> Solicitar correção de dados incorretos</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Exclusão:</Text> Solicitar a exclusão de seus dados</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Portabilidade:</Text> Receber seus dados em formato estruturado</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Revogação:</Text> Revogar consentimento a qualquer momento</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Oposição:</Text> Opor-se ao tratamento de dados</Text>
            </View>

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>7.1. Responsabilidades Específicas da Empresa</Text>
                <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                  Como empresa parceira, você tem responsabilidades adicionais:
                </Text>
                
                <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Responsabilidades Legais:</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>LGPD:</Text> Cumprir todas as obrigações da Lei Geral de Proteção de Dados</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Direitos Autorais:</Text> Garantir que todo conteúdo seja próprio ou licenciado</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Propriedade Intelectual:</Text> Respeitar marcas e patentes de terceiros</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Leis Trabalhistas:</Text> Cumprir legislação trabalhista aplicável</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Leis Sanitárias:</Text> Seguir normas de higiene e segurança alimentar</Text>
                
                <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Responsabilidades Operacionais:</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Precisão:</Text> Manter informações sempre atualizadas e precisas</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Disponibilidade:</Text> Garantir que produtos anunciados estejam disponíveis</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Qualidade:</Text> Manter padrão de qualidade dos produtos/serviços</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Atendimento:</Text> Responder adequadamente aos clientes</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Transparência:</Text> Ser transparente sobre preços e condições</Text>
                
                <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Responsabilidades de Conteúdo:</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Imagens:</Text> Usar apenas fotos próprias ou com autorização</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Descrições:</Text> Fornecer informações verdadeiras e não enganosas</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Preços:</Text> Manter preços atualizados e sem cobranças ocultas</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Disponibilidade:</Text> Informar sobre produtos indisponíveis</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Alergênicos:</Text> Informar sobre ingredientes que causam alergias</Text>
                
                <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                  <Text style={politicaStyles.highlight}>Consequências:</Text> O descumprimento destas responsabilidades pode resultar em suspensão da conta, remoção de conteúdo ou encerramento da parceria.
                </Text>
              </View>
            )}

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>8. Retenção de Dados</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta Política, respeitando:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Obrigações legais e regulatórias</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Necessidades de negócio legítimas</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Resolução de disputas</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Cumprimento de acordos</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>9. Marketing e Comunicações</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Só enviaremos comunicações promocionais com seu consentimento explícito. Você pode:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Revogar o consentimento a qualquer momento</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Cancelar inscrições em newsletters</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Configurar preferências de comunicação</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>10. Cookies e Tecnologias Similares</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Utilizamos cookies e tecnologias similares para:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Melhorar a funcionalidade do aplicativo</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Analisar o uso e performance</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Personalizar a experiência</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Fornecer conteúdo relevante</Text>
            </View>

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>10.1. Política de Conteúdo para Empresas</Text>
                <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                  Ao utilizar nossa plataforma, você concorda em não compartilhar conteúdo que:
                </Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Violar direitos autorais:</Text> Imagens, textos ou músicas sem autorização</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Ser inadequado:</Text> Conteúdo ofensivo, discriminatório ou ilegal</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Promover violência:</Text> Imagens ou descrições que incitem violência</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Ser enganoso:</Text> Informações falsas sobre produtos ou serviços</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Violar privacidade:</Text> Dados pessoais de terceiros sem consentimento</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• <Text style={politicaStyles.highlight}>Ser comercial inadequado:</Text> Spam, propaganda excessiva ou concorrência desleal</Text>
                
                <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Responsabilidades da Empresa:</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Garantir que todas as imagens e descrições sejam próprias ou licenciadas</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Manter informações atualizadas e precisas</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Respeitar direitos de terceiros</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Não usar a plataforma para atividades ilegais</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Responder por danos causados por conteúdo inadequado</Text>
                
                <Text style={[politicaStyles.sectionSubtitle, (isSmallScreen || !isTablet) && politicaStyles.sectionSubtitleMobile]}>Ações da Plataforma:</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Monitoramento automático e manual de conteúdo</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Remoção imediata de conteúdo inadequado</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Suspensão temporária ou permanente da conta</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Notificação às autoridades quando necessário</Text>
                <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Direito de recusar ou remover qualquer conteúdo</Text>
              </View>
            )}

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>11. Alterações na Política</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Esta Política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através do aplicativo ou e-mail.
              </Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={[politicaStyles.sectionTitle, (isSmallScreen || !isTablet) && politicaStyles.sectionTitleMobile]}>12. Contato</Text>
              <Text style={[politicaStyles.text, (isSmallScreen || !isTablet) && politicaStyles.textMobile]}>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política:
              </Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• E-mail: privacidade@japonesapp.com</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Telefone: (11) 99999-9999</Text>
              <Text style={[politicaStyles.listItem, (isSmallScreen || !isTablet) && politicaStyles.listItemMobile]}>• Endereço: Rua da Privacidade, 123 - São Paulo/SP</Text>
            </View>

            <View style={politicaStyles.footer}>
              <Text style={[politicaStyles.footerText, (isSmallScreen || !isTablet) && politicaStyles.footerTextMobile]}>
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </Text>
              <Text style={[politicaStyles.footerText, (isSmallScreen || !isTablet) && politicaStyles.footerTextMobile]}>
                Esta política está em conformidade com a LGPD (Lei nº 13.709/2018)
              </Text>
            </View>
          </ScrollView>
        </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PoliticaProtecaoDados; 