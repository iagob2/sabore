import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput, Switch, Dimensions, Image } from 'react-native';
import Input from '../components/Input';
import { indexStyles } from '../style/indexStyles';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import PoliticaProtecaoDados from './politicaProtecaoDados';
import { colors } from '../style/colors';
import { cadastrarRestaurante, uploadRestauranteArquivo } from '../api/restaurante';
import { buscarEnderecoPorCep } from '../api/cliente';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLargeScreen = SCREEN_WIDTH > 900;
const isMediumScreen = SCREEN_WIDTH > 600;

const CadastrarEmpresa = () => {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horario, setHorario] = useState('');
  const [lotacao, setLotacao] = useState('');
  const [site, setSite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cardapio, setCardapio] = useState(null);
  const [aceitaComunicacao, setAceitaComunicacao] = useState(false);
  const [aceitaMarketing, setAceitaMarketing] = useState(false);
  const [aceitaProtecaoDados, setAceitaProtecaoDados] = useState(false);
  const [politicaVisible, setPoliticaVisible] = useState(false);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const handlePickCardapio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result && result.assets && result.assets.length > 0) {
      setCardapio(result.assets[0]);
    }
  };

  const handlePickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLogo(result.assets[0]);
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
      setBanner(result.assets[0]);
    }
  };

  const tryAutoFillByCep = async (value: string) => {
    setCep(value);
    const digits = (value || '').replace(/\D/g, '');
    if (digits.length === 8) {
      setIsFetchingCep(true);
      try {
        const endereco = await buscarEnderecoPorCep(digits);
        setRua(endereco.rua || '');
        setBairro(endereco.bairro || '');
        setCidade(endereco.cidade || '');
        setEstado(endereco.estado || '');
      } catch (e) {
        // mantém silencioso aqui; feedback pode ser adicionado se quiser
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const handleRegister = async () => {
    if (!aceitaProtecaoDados) {
      Alert.alert('Atenção', 'É necessário aceitar a política de proteção de dados para continuar.');
      return;
    }
    if (!nome || !cnpj || !email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha Nome, CNPJ, E-mail e Senha.');
      return;
    }
    setSubmitting(true);
    try {
      const numeroParsed = Number.isFinite(parseInt(numero as any, 10)) ? parseInt(numero as any, 10) : undefined;
      const lotacaoParsed = Number.isFinite(parseInt(lotacao as any, 10)) ? parseInt(lotacao as any, 10) : undefined;

      // 1) Faz upload dos arquivos, quando houverem
      let logoUrl: string | undefined;
      let bannerUrl: string | undefined;
      let cardapioUrl: string | undefined;
      if (logo && logo.uri) {
        try { logoUrl = await uploadRestauranteArquivo('logo', { uri: logo.uri, name: logo.name || 'logo.jpg' }); } catch {}
      }
      if (banner && banner.uri) {
        try { bannerUrl = await uploadRestauranteArquivo('banner', { uri: banner.uri, name: banner.name || 'banner.jpg' }); } catch {}
      }
      if (cardapio && cardapio.uri) {
        try { cardapioUrl = await uploadRestauranteArquivo('cardapio', { uri: cardapio.uri, name: cardapio.name || 'cardapio.pdf' }); } catch {}
      }

      await cadastrarRestaurante({
        nome,
        cnpj,
        telefone: telefone || undefined,
        email,
        senha,
        rua: rua || undefined,
        numero: numeroParsed,
        bairro: bairro || undefined,
        cidade: cidade || undefined,
        estado: estado || undefined,
        cep: cep || undefined,
        descricao: descricao || undefined,
        horario: horario || undefined,
        lotacao: lotacaoParsed,
        site: site || undefined,
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        whatsapp: whatsapp || undefined,
        cardapioUrl,
        logoUrl,
        bannerUrl,
        aceitaComunicacao,
        aceitaMarketing,
        aceitaProtecaoDados,
      });
      Alert.alert('Sucesso', 'Empresa cadastrada com sucesso!');
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Falha ao cadastrar empresa');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header logo="Japones APP" />
      <ScrollView style={{ flex: 1, backgroundColor: colors.branco }} contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 16 }}>
        <View style={{ width: '100%', maxWidth: 1200, alignSelf: 'center' }}>
          
          {/* Cabeçalho */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ color: colors.verdeFolha, fontSize: 32, fontWeight: 'bold', marginBottom: 16 }}>Cadastro de Empresa</Text>
            <Text style={{ color: colors.preto, fontSize: 16, textAlign: 'center', maxWidth: 600, lineHeight: 24 }}>
              Preencha os dados abaixo para cadastrar seu estabelecimento no Saborê. 
              Após a aprovação, você poderá gerenciar seu perfil e receber pedidos.
            </Text>
          </View>

          {/* Informações sobre Custos */}
          <View style={{ 
            backgroundColor: colors.branco, 
            borderWidth: 2, 
            borderColor: colors.marromFeijao, 
            borderRadius: 12, 
            padding: 20, 
            marginBottom: 32,
            borderStyle: 'dashed'
          }}>
            <Text style={{ color: colors.verdeFolha, fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
              💰 Informações sobre Custos
            </Text>
            <Text style={{ color: colors.preto, fontSize: 14, lineHeight: 20, textAlign: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>Taxa por pedido:</Text> R$ 1,00 por pedido aceito.{'\n'}
              <Text style={{ fontWeight: 'bold' }}>Pagamento:</Text> Mensal, até o dia 10 do mês seguinte.{'\n'}
              <Text style={{ fontWeight: 'bold' }}>Sem taxa de adesão</Text> ou mensalidade fixa.{'\n'}
              <Text style={{ fontWeight: 'bold' }}>Sem comissão</Text> sobre o valor dos pedidos.
            </Text>
          </View>

          {/* Formulário em Colunas */}
          <View style={{ 
            flexDirection: isLargeScreen ? 'row' : 'column',
            gap: 24,
            marginBottom: 32
          }}>
            
            {/* Coluna 1 - Informações Básicas */}
            <View style={{ flex: isLargeScreen ? 1 : undefined }}>
              <View style={{ 
                backgroundColor: colors.branco, 
                borderWidth: 1, 
                borderColor: colors.marromFeijao, 
                borderRadius: 12, 
                padding: 20,
                shadowColor: colors.marromFeijao,
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  📋 Informações Básicas
                </Text>
                <Input label="Nome da empresa" placeholder="Digite o nome" value={nome} onChangeText={setNome} />
                <Input label="CNPJ" placeholder="00.000.000/0000-00" value={cnpj} onChangeText={setCnpj} />
                <Input label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChangeText={setTelefone} />
                <Input label="E-mail" placeholder="contato@empresa.com" value={email} onChangeText={setEmail} />
                <Input label="Senha" placeholder="Digite uma senha" value={senha} onChangeText={setSenha} secureTextEntry />
              </View>
            </View>

            {/* Coluna 2 - Endereço */}
            <View style={{ flex: isLargeScreen ? 1 : undefined }}>
              <View style={{ 
                backgroundColor: colors.branco, 
                borderWidth: 1, 
                borderColor: colors.marromFeijao, 
                borderRadius: 12, 
                padding: 20,
                shadowColor: colors.marromFeijao,
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  📍 Endereço
                </Text>
                <Input label="CEP" placeholder="00000-000" value={cep} onChangeText={tryAutoFillByCep} />
                <Input label="Estado" placeholder="SP" value={estado} onChangeText={setEstado} />
                <Input label="Cidade" placeholder="Santos" value={cidade} onChangeText={setCidade} />
                <Input label="Bairro" placeholder="Centro" value={bairro} onChangeText={setBairro} />
                <Input label="Rua" placeholder="Rua das Flores" value={rua} onChangeText={setRua} />
                <Input label="Número" placeholder="123" value={numero} onChangeText={setNumero} />
              </View>
            </View>

            {/* Coluna 3 - Informações do Negócio */}
            <View style={{ flex: isLargeScreen ? 1 : undefined }}>
              <View style={{ 
                backgroundColor: colors.branco, 
                borderWidth: 1, 
                borderColor: colors.marromFeijao, 
                borderRadius: 12, 
                padding: 20,
                shadowColor: colors.marromFeijao,
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  🏢 Informações do Negócio
                </Text>
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ color: colors.verdeFolha, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Descrição</Text>
                  <TextInput
                    style={{
                      backgroundColor: colors.branco,
                      borderWidth: 1,
                      borderColor: colors.marromFeijao,
                      borderRadius: 8,
                      padding: 12,
                      color: colors.preto,
                      fontSize: 16,
                      minHeight: 80,
                      textAlignVertical: 'top'
                    }}
                    placeholder="Descreva seu estabelecimento..."
                    placeholderTextColor={colors.preto + '88'}
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                  />
                </View>
                <Input label="Horário de funcionamento" placeholder="Ex: Seg-Sex: 18h-23h" value={horario} onChangeText={setHorario} />
                <Input label="Lotação" placeholder="Ex: 6 mesas simultâneas" value={lotacao} onChangeText={setLotacao} />
              </View>
            </View>
          </View>

          {/* Segunda Linha - Links Sociais e Cardápio */}
          <View style={{ 
            flexDirection: isLargeScreen ? 'row' : 'column',
            gap: 24,
            marginBottom: 32
          }}>
            
            {/* Links Sociais */}
            <View style={{ flex: isLargeScreen ? 1 : undefined }}>
              <View style={{ 
                backgroundColor: colors.branco, 
                borderWidth: 1, 
                borderColor: colors.marromFeijao, 
                borderRadius: 12, 
                padding: 20,
                shadowColor: colors.marromFeijao,
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  🌐 Links Sociais
                </Text>
                <Input label="Site" placeholder="https://www.seusite.com" value={site} onChangeText={setSite} />
                <Input label="Facebook" placeholder="https://facebook.com/suaempresa" value={facebook} onChangeText={setFacebook} />
                <Input label="Instagram" placeholder="https://instagram.com/suaempresa" value={instagram} onChangeText={setInstagram} />
                <Input label="WhatsApp" placeholder="https://wa.me/5511999999999" value={whatsapp} onChangeText={setWhatsapp} />
              </View>
            </View>

            {/* Cardápio e Autorizações */}
            <View style={{ flex: isLargeScreen ? 1 : undefined }}>
              <View style={{ 
                backgroundColor: colors.branco, 
                borderWidth: 1, 
                borderColor: colors.marromFeijao, 
                borderRadius: 12, 
                padding: 20,
                shadowColor: colors.marromFeijao,
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  📄 Cardápio e Autorizações
                </Text>
                
                {/* Upload do Cardápio */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: colors.verdeFolha, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Cardápio (PDF)</Text>
                  <TouchableOpacity 
                    onPress={handlePickCardapio} 
                    style={{ 
                      backgroundColor: colors.verdeFolha, 
                      paddingVertical: 12, 
                      paddingHorizontal: 16, 
                      borderRadius: 8, 
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: colors.verdeFolha
                    }}
                  >
                    <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 16 }}>
                      {cardapio ? `✓ ${cardapio.name}` : '📎 Selecionar Cardápio (PDF)'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Upload de Logo */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: colors.verdeFolha, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Logo da Empresa (1:1)</Text>
                  <TouchableOpacity 
                    onPress={handlePickLogo}
                    style={{
                      backgroundColor: colors.verdeFolha,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: colors.verdeFolha,
                      marginBottom: 10
                    }}
                  >
                    <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 15 }}>
                      {logo ? `✓ Logo selecionado` : '📷 Selecionar Logo'}
                    </Text>
                  </TouchableOpacity>
                  {logo && (
                    <View style={{ alignItems: 'center', marginBottom: 12 }}>
                      <Text style={{ color: colors.marromFeijao, fontSize: 12, marginBottom: 4 }}>Prévia:</Text>
                      <View style={{ width: 90, height: 90, borderRadius: 45, overflow: 'hidden', borderWidth: 2, borderColor: colors.verdeFolha }}>
                        <Image source={{ uri: logo.uri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                      </View>
                    </View>
                  )}
                </View>

                {/* Upload de Banner */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: colors.verdeFolha, fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 8 }}>Banner do Restaurante (3:1)</Text>
                  <TouchableOpacity 
                    onPress={handlePickBanner}
                    style={{
                      backgroundColor: colors.verdeFolha,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: colors.verdeFolha,
                      marginBottom: 10
                    }}
                  >
                    <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 15 }}>
                      {banner ? `✓ Banner selecionado` : '🖼️ Selecionar Banner'}
                    </Text>
                  </TouchableOpacity>
                  {banner && (
                    <View style={{ alignItems: 'center', marginBottom: 12 }}>
                      <Text style={{ color: colors.marromFeijao, fontSize: 12, marginBottom: 4 }}>Prévia:</Text>
                      <View style={{ width: 180, height: 60, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: colors.verdeFolha }}>
                        <Image source={{ uri: banner.uri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                      </View>
                    </View>
                  )}
                </View>

                {/* Autorizações */}
                <View style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Switch
                      value={aceitaComunicacao}
                      onValueChange={setAceitaComunicacao}
                      trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                      thumbColor={aceitaComunicacao ? colors.branco : '#f4f3f4'}
                    />
                    <Text style={{ color: colors.preto, fontSize: 14, marginLeft: 12, flex: 1 }}>
                      Autorizo o uso do e-mail e telefone para comunicação sobre pedidos
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Switch
                      value={aceitaMarketing}
                      onValueChange={setAceitaMarketing}
                      trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                      thumbColor={aceitaMarketing ? colors.branco : '#f4f3f4'}
                    />
                    <Text style={{ color: colors.preto, fontSize: 14, marginLeft: 12, flex: 1 }}>
                      Aceito receber ofertas e novidades por e-mail
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Switch
                      value={aceitaProtecaoDados}
                      onValueChange={setAceitaProtecaoDados}
                      trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                      thumbColor={aceitaProtecaoDados ? colors.branco : '#f4f3f4'}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: colors.preto, fontSize: 14, marginLeft: 12, flex: 1 }}>
                        Li e aceito a política de proteção de dados *
                      </Text>
                      <TouchableOpacity 
                        onPress={() => setPoliticaVisible(true)}
                        style={{ 
                          backgroundColor: colors.verdeFolha, 
                          width: 20, 
                          height: 20, 
                          borderRadius: 10, 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginLeft: 8
                        }}
                      >
                        <Text style={{ color: colors.branco, fontSize: 12, fontWeight: 'bold' }}>?</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <Text style={{ color: '#666', fontSize: 12, fontStyle: 'italic', textAlign: 'center' }}>
                  * Campo obrigatório para prosseguir com o cadastro
                </Text>
              </View>
            </View>
          </View>

          {/* Botão de Registro */}
          <View style={{ alignItems: 'center' }}>
              <TouchableOpacity 
              onPress={handleRegister} 
              style={{ 
                backgroundColor: aceitaProtecaoDados ? colors.verdeFolha : '#ccc', 
                paddingVertical: 16, 
                paddingHorizontal: 48, 
                borderRadius: 12, 
                width: '100%',
                maxWidth: 400,
                alignItems: 'center',
                shadowColor: colors.marromFeijao,
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6
              }}
              disabled={submitting || !aceitaProtecaoDados}
            >
              <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>
                {aceitaProtecaoDados ? (submitting ? 'Enviando...' : '📝 Registrar Empresa') : 'Aceite a política de dados para continuar'}
              </Text>
            </TouchableOpacity>
            
            <Text style={{ color: '#666', fontSize: 12, textAlign: 'center', marginTop: 16, maxWidth: 500 }}>
              Após o envio, nossa equipe analisará os dados e entrará em contato em até 48 horas para confirmar o cadastro.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal da Política de Proteção de Dados */}
      <PoliticaProtecaoDados
        visible={politicaVisible}
        onClose={() => setPoliticaVisible(false)}
        tipo="empresa"
      />
    </>
  );
};

export default CadastrarEmpresa; 