import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../style/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLargeScreen = SCREEN_WIDTH > 900;

const politicaStyles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.verdeFolha,
  },
  title: {
    color: colors.verdeFolha,
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
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
  sectionSubtitle: {
    color: colors.verdeFolha,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  text: {
    color: colors.preto,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  listItem: {
    color: colors.preto,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    paddingLeft: 16,
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
});

interface PoliticaProtecaoDadosProps {
  visible: boolean;
  onClose: () => void;
  tipo: 'usuario' | 'empresa';
}

const PoliticaProtecaoDados = ({ visible, onClose, tipo }: PoliticaProtecaoDadosProps) => {
  const isEmpresa = tipo === 'empresa';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={politicaStyles.modalContainer}>
        <View style={politicaStyles.modalContent}>
          <View style={politicaStyles.header}>
            <Text style={politicaStyles.title}>
              Política de Proteção de Dados
            </Text>
            <TouchableOpacity onPress={onClose} style={politicaStyles.closeButton}>
              <Icon name="times" size={24} color={colors.verdeFolha} />
            </TouchableOpacity>
          </View>

          <ScrollView style={politicaStyles.content} showsVerticalScrollIndicator={false}>
            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>1. Introdução</Text>
              <Text style={politicaStyles.text}>
                Esta Política de Proteção de Dados ("Política") descreve como o Saborê coleta, usa, armazena e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais legislações aplicáveis.
              </Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>2. Dados Coletados</Text>
              
              <Text style={politicaStyles.sectionSubtitle}>Para {isEmpresa ? 'Empresas' : 'Usuários'}:</Text>
              {isEmpresa ? (
                <>
                  <Text style={politicaStyles.listItem}>• Nome da empresa e CNPJ</Text>
                  <Text style={politicaStyles.listItem}>• Telefone e e-mail de contato</Text>
                  <Text style={politicaStyles.listItem}>• Endereço completo</Text>
                  <Text style={politicaStyles.listItem}>• Descrição do estabelecimento</Text>
                  <Text style={politicaStyles.listItem}>• Horário de funcionamento</Text>
                  <Text style={politicaStyles.listItem}>• Links de redes sociais</Text>
                  <Text style={politicaStyles.listItem}>• Cardápio em formato PDF</Text>
                  <Text style={politicaStyles.listItem}>• Imagens do estabelecimento e pratos</Text>
                  <Text style={politicaStyles.listItem}>• Dados de faturamento e pedidos</Text>
                  <Text style={politicaStyles.listItem}>• Avaliações e feedback dos clientes</Text>
                </>
              ) : (
                <>
                  <Text style={politicaStyles.listItem}>• Nome completo e CPF</Text>
                  <Text style={politicaStyles.listItem}>• Telefone e e-mail</Text>
                  <Text style={politicaStyles.listItem}>• Histórico de pedidos</Text>
                  <Text style={politicaStyles.listItem}>• Preferências de restaurantes</Text>
                  <Text style={politicaStyles.listItem}>• Avaliações e comentários</Text>
                </>
              )}
            </View>

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={politicaStyles.sectionTitle}>2.1. Dados NÃO Coletados de Empresas</Text>
                <Text style={politicaStyles.text}>
                  Para proteger a privacidade e segurança, NÃO coletamos:
                </Text>
                <Text style={politicaStyles.listItem}>• Dados pessoais dos funcionários (CPF, RG, etc.)</Text>
                <Text style={politicaStyles.listItem}>• Informações bancárias detalhadas</Text>
                <Text style={politicaStyles.listItem}>• Documentos fiscais internos</Text>
                <Text style={politicaStyles.listItem}>• Estratégias comerciais confidenciais</Text>
                <Text style={politicaStyles.listItem}>• Dados de fornecedores terceiros</Text>
                <Text style={politicaStyles.listItem}>• Informações de concorrentes</Text>
                <Text style={politicaStyles.listItem}>• Dados pessoais de clientes (apenas dados agregados)</Text>
              </View>
            )}

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={politicaStyles.sectionTitle}>2.2. Diferenciação: Dados de Empresa vs. Dados de Usuário</Text>
                <Text style={politicaStyles.text}>
                  É importante entender que empresas e usuários têm perfis e responsabilidades diferentes:
                </Text>
                
                <Text style={politicaStyles.sectionSubtitle}>Dados de Empresa (Públicos):</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Visibilidade:</Text> Informações visíveis a todos os usuários</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Propósito:</Text> Facilitar escolhas e pedidos dos clientes</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Responsabilidade:</Text> Empresa é responsável pela precisão</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Controle:</Text> Empresa pode editar e atualizar</Text>
                
                <Text style={politicaStyles.sectionSubtitle}>Dados de Usuário (Privados):</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Visibilidade:</Text> Apenas para o próprio usuário e plataforma</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Propósito:</Text> Funcionamento do aplicativo e histórico pessoal</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Responsabilidade:</Text> Plataforma protege e gerencia</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Controle:</Text> Usuário pode excluir ou modificar</Text>
                
                <Text style={politicaStyles.text}>
                  <Text style={politicaStyles.highlight}>Importante:</Text> Empresas não têm acesso a dados pessoais de usuários individuais, apenas a dados agregados para fins de análise de negócio.
                </Text>
              </View>
            )}

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>3. Finalidades do Tratamento</Text>
              <Text style={politicaStyles.text}>
                Seus dados pessoais são utilizados para as seguintes finalidades:
              </Text>
              <Text style={politicaStyles.listItem}>• Prestação dos serviços do aplicativo</Text>
              <Text style={politicaStyles.listItem}>• Processamento de pedidos e pagamentos</Text>
              <Text style={politicaStyles.listItem}>• Comunicação sobre pedidos e status</Text>
              <Text style={politicaStyles.listItem}>• Melhoria da experiência do usuário</Text>
              <Text style={politicaStyles.listItem}>• Suporte ao cliente</Text>
              <Text style={politicaStyles.listItem}>• Marketing (apenas com consentimento)</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>4. Base Legal</Text>
              <Text style={politicaStyles.text}>
                O tratamento de seus dados é baseado nas seguintes hipóteses legais da LGPD:
              </Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Consentimento:</Text> Para marketing e comunicações promocionais</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Execução de contrato:</Text> Para prestação dos serviços</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Legítimo interesse:</Text> Para melhorias e segurança</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Cumprimento de obrigação legal:</Text> Para fins fiscais e regulatórios</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>5. Compartilhamento de Dados</Text>
              <Text style={politicaStyles.text}>
                Seus dados podem ser compartilhados com:
              </Text>
              <Text style={politicaStyles.listItem}>• Restaurantes para processamento de pedidos</Text>
              <Text style={politicaStyles.listItem}>• Prestadores de serviços de pagamento</Text>
              <Text style={politicaStyles.listItem}>• Serviços de entrega</Text>
              <Text style={politicaStyles.listItem}>• Autoridades competentes (quando exigido por lei)</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>6. Segurança dos Dados</Text>
              <Text style={politicaStyles.text}>
                Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra:
              </Text>
              <Text style={politicaStyles.listItem}>• Acesso não autorizado</Text>
              <Text style={politicaStyles.listItem}>• Alteração, divulgação ou destruição não autorizada</Text>
              <Text style={politicaStyles.listItem}>• Perda acidental</Text>
              <Text style={politicaStyles.listItem}>• Processamento ilegal</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>7. Seus Direitos</Text>
              <Text style={politicaStyles.text}>
                Conforme a LGPD, você tem os seguintes direitos:
              </Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Acesso:</Text> Solicitar informações sobre seus dados</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Correção:</Text> Solicitar correção de dados incorretos</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Exclusão:</Text> Solicitar a exclusão de seus dados</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Portabilidade:</Text> Receber seus dados em formato estruturado</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Revogação:</Text> Revogar consentimento a qualquer momento</Text>
              <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Oposição:</Text> Opor-se ao tratamento de dados</Text>
            </View>

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={politicaStyles.sectionTitle}>7.1. Responsabilidades Específicas da Empresa</Text>
                <Text style={politicaStyles.text}>
                  Como empresa parceira, você tem responsabilidades adicionais:
                </Text>
                
                <Text style={politicaStyles.sectionSubtitle}>Responsabilidades Legais:</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>LGPD:</Text> Cumprir todas as obrigações da Lei Geral de Proteção de Dados</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Direitos Autorais:</Text> Garantir que todo conteúdo seja próprio ou licenciado</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Propriedade Intelectual:</Text> Respeitar marcas e patentes de terceiros</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Leis Trabalhistas:</Text> Cumprir legislação trabalhista aplicável</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Leis Sanitárias:</Text> Seguir normas de higiene e segurança alimentar</Text>
                
                <Text style={politicaStyles.sectionSubtitle}>Responsabilidades Operacionais:</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Precisão:</Text> Manter informações sempre atualizadas e precisas</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Disponibilidade:</Text> Garantir que produtos anunciados estejam disponíveis</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Qualidade:</Text> Manter padrão de qualidade dos produtos/serviços</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Atendimento:</Text> Responder adequadamente aos clientes</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Transparência:</Text> Ser transparente sobre preços e condições</Text>
                
                <Text style={politicaStyles.sectionSubtitle}>Responsabilidades de Conteúdo:</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Imagens:</Text> Usar apenas fotos próprias ou com autorização</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Descrições:</Text> Fornecer informações verdadeiras e não enganosas</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Preços:</Text> Manter preços atualizados e sem cobranças ocultas</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Disponibilidade:</Text> Informar sobre produtos indisponíveis</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Alergênicos:</Text> Informar sobre ingredientes que causam alergias</Text>
                
                <Text style={politicaStyles.text}>
                  <Text style={politicaStyles.highlight}>Consequências:</Text> O descumprimento destas responsabilidades pode resultar em suspensão da conta, remoção de conteúdo ou encerramento da parceria.
                </Text>
              </View>
            )}

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>8. Retenção de Dados</Text>
              <Text style={politicaStyles.text}>
                Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta Política, respeitando:
              </Text>
              <Text style={politicaStyles.listItem}>• Obrigações legais e regulatórias</Text>
              <Text style={politicaStyles.listItem}>• Necessidades de negócio legítimas</Text>
              <Text style={politicaStyles.listItem}>• Resolução de disputas</Text>
              <Text style={politicaStyles.listItem}>• Cumprimento de acordos</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>9. Marketing e Comunicações</Text>
              <Text style={politicaStyles.text}>
                Só enviaremos comunicações promocionais com seu consentimento explícito. Você pode:
              </Text>
              <Text style={politicaStyles.listItem}>• Revogar o consentimento a qualquer momento</Text>
              <Text style={politicaStyles.listItem}>• Cancelar inscrições em newsletters</Text>
              <Text style={politicaStyles.listItem}>• Configurar preferências de comunicação</Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>10. Cookies e Tecnologias Similares</Text>
              <Text style={politicaStyles.text}>
                Utilizamos cookies e tecnologias similares para:
              </Text>
              <Text style={politicaStyles.listItem}>• Melhorar a funcionalidade do aplicativo</Text>
              <Text style={politicaStyles.listItem}>• Analisar o uso e performance</Text>
              <Text style={politicaStyles.listItem}>• Personalizar a experiência</Text>
              <Text style={politicaStyles.listItem}>• Fornecer conteúdo relevante</Text>
            </View>

            {isEmpresa && (
              <View style={politicaStyles.section}>
                <Text style={politicaStyles.sectionTitle}>10.1. Política de Conteúdo para Empresas</Text>
                <Text style={politicaStyles.text}>
                  Ao utilizar nossa plataforma, você concorda em não compartilhar conteúdo que:
                </Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Violar direitos autorais:</Text> Imagens, textos ou músicas sem autorização</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Ser inadequado:</Text> Conteúdo ofensivo, discriminatório ou ilegal</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Promover violência:</Text> Imagens ou descrições que incitem violência</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Ser enganoso:</Text> Informações falsas sobre produtos ou serviços</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Violar privacidade:</Text> Dados pessoais de terceiros sem consentimento</Text>
                <Text style={politicaStyles.listItem}>• <Text style={politicaStyles.highlight}>Ser comercial inadequado:</Text> Spam, propaganda excessiva ou concorrência desleal</Text>
                
                <Text style={politicaStyles.sectionSubtitle}>Responsabilidades da Empresa:</Text>
                <Text style={politicaStyles.listItem}>• Garantir que todas as imagens e descrições sejam próprias ou licenciadas</Text>
                <Text style={politicaStyles.listItem}>• Manter informações atualizadas e precisas</Text>
                <Text style={politicaStyles.listItem}>• Respeitar direitos de terceiros</Text>
                <Text style={politicaStyles.listItem}>• Não usar a plataforma para atividades ilegais</Text>
                <Text style={politicaStyles.listItem}>• Responder por danos causados por conteúdo inadequado</Text>
                
                <Text style={politicaStyles.sectionSubtitle}>Ações da Plataforma:</Text>
                <Text style={politicaStyles.listItem}>• Monitoramento automático e manual de conteúdo</Text>
                <Text style={politicaStyles.listItem}>• Remoção imediata de conteúdo inadequado</Text>
                <Text style={politicaStyles.listItem}>• Suspensão temporária ou permanente da conta</Text>
                <Text style={politicaStyles.listItem}>• Notificação às autoridades quando necessário</Text>
                <Text style={politicaStyles.listItem}>• Direito de recusar ou remover qualquer conteúdo</Text>
              </View>
            )}

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>11. Alterações na Política</Text>
              <Text style={politicaStyles.text}>
                Esta Política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através do aplicativo ou e-mail.
              </Text>
            </View>

            <View style={politicaStyles.section}>
              <Text style={politicaStyles.sectionTitle}>12. Contato</Text>
              <Text style={politicaStyles.text}>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política:
              </Text>
              <Text style={politicaStyles.listItem}>• E-mail: privacidade@japonesapp.com</Text>
              <Text style={politicaStyles.listItem}>• Telefone: (11) 99999-9999</Text>
              <Text style={politicaStyles.listItem}>• Endereço: Rua da Privacidade, 123 - São Paulo/SP</Text>
            </View>

            <View style={politicaStyles.footer}>
              <Text style={politicaStyles.footerText}>
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </Text>
              <Text style={politicaStyles.footerText}>
                Esta política está em conformidade com a LGPD (Lei nº 13.709/2018)
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PoliticaProtecaoDados; 