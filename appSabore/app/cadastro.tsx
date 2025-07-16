import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, ImageBackground, Switch } from 'react-native';
import Input from '../components/Input';
import { indexStyles } from '../style/indexStyles';
import Header from '../components/Header';
import { useRouter } from 'expo-router';
import PoliticaProtecaoDados from './politicaProtecaoDados';
import { colors } from '../style/colors';

const logoApp = require('../assets/logo-sabore.png');
const sashimiBanner = require('../assets/banner-sabore.png');

const cadastroStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.verdeFolha,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.verdeFolha,
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderRadius: 8,
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 340,
  },
  buttonText: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    backgroundColor: colors.branco,
    borderRadius: 18,
    padding: 20,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.marromFeijao,
  },
  formRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 10,
  },
  formColumn: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  switchText: {
    color: colors.preto,
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  requiredText: {
    color: '#666',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

const SCREEN_WIDTH = Dimensions.get('window').width;
const isLargeScreen = SCREEN_WIDTH > 700;
const isMediumScreen = SCREEN_WIDTH > 500;

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [aceitaProtecaoDados, setAceitaProtecaoDados] = useState(false);
  const [aceitaMarketing, setAceitaMarketing] = useState(false);
  const [aceitaAtendimento, setAceitaAtendimento] = useState(false);
  const [erro, setErro] = useState('');
  const [politicaVisible, setPoliticaVisible] = useState(false);
  const router = useRouter();

  const handleRegister = () => {
    if (!nome || !telefone || !cpf || !email || !senha) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    
    if (!aceitaProtecaoDados) {
      setErro('É necessário aceitar a política de proteção de dados para continuar.');
      return;
    }
    
    setErro('');
    // Aqui você pode adicionar a lógica de cadastro
    alert(`Nome: ${nome}\nTelefone: ${telefone}\nCPF: ${cpf}\nEmail: ${email}\nSenha: ${senha}\nAceita Proteção de Dados: ${aceitaProtecaoDados ? 'Sim' : 'Não'}\nAceita Marketing: ${aceitaMarketing ? 'Sim' : 'Não'}\nAceita Atendimento: ${aceitaAtendimento ? 'Sim' : 'Não'}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.branco }}>
      <Header logo="Japonés.app" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 16 }}>
        <View style={{
          flex: 1,
          flexDirection: isLargeScreen ? 'row' : 'column',
          alignItems: isLargeScreen ? 'flex-start' : 'center',
          justifyContent: 'center',
          minHeight: '100%',
          marginTop: 0,
          gap: isLargeScreen ? 16 : 24,
        }}>
          {/* Coluna Esquerda: Banner com logo centralizado */}
          <View style={{
            width: isLargeScreen ? '50%' : '100%',
            minWidth: isLargeScreen ? 400 : '100%',
            maxWidth: isLargeScreen ? 600 : '100%',
            height: isLargeScreen ? 500 : 220,
            alignItems: 'center',
            justifyContent: 'center',
            display: isLargeScreen ? 'flex' : 'flex',
          }}>
            <ImageBackground
              source={sashimiBanner}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                borderRadius: 32,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              imageStyle={{ borderRadius: 32, resizeMode: 'cover' }}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}>
                <View style={{
                  width: 170,
                  height: 170,
                  borderRadius: 85,
                  borderWidth: 5,
                  borderColor: colors.marromFeijao,
                  backgroundColor: colors.branco,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: colors.marromFeijao,
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                  elevation: 8,
                }}>
                  <Image source={logoApp} style={{ width: 150, height: 150, borderRadius: 75, resizeMode: 'contain' }} />
                </View>
              </View>
            </ImageBackground>
            {/* Frase convidativa abaixo do banner */}
            <Text style={{
              color: colors.verdeFolha,
              fontSize: isLargeScreen ? 20 : 16,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 18,
              marginBottom: isLargeScreen ? 0 : 18,
              maxWidth: 420,
              letterSpacing: 0.5,
            }}>
              "No Brasil, cada novo cadastro é um convite à mesa. Venha fazer parte dessa história de sabores!"
            </Text>
          </View>
          {/* Coluna Direita: Formulário */}
          <View style={{
            width: isLargeScreen ? '50%' : '100%',
            minWidth: isLargeScreen ? 400 : '100%',
            maxWidth: isLargeScreen ? 600 : '100%',
            height: isLargeScreen ? 500 : undefined,
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: colors.branco,
            flex: 1,
            paddingTop: isLargeScreen ? 0 : undefined,
          }}>
            <View style={cadastroStyles.form}>
              <Text style={cadastroStyles.title}>Cadastro</Text>
              
              {/* Primeira linha: Nome e Telefone */}
              <View style={[cadastroStyles.formRow, { display: isMediumScreen ? 'flex' : 'none' }]}>
                <View style={cadastroStyles.formColumn}>
                  <Input
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChangeText={setNome}
                  />
                </View>
                <View style={cadastroStyles.formColumn}>
                  <Input
                    label="Telefone"
                    placeholder="Digite seu telefone"
                    value={telefone}
                    onChangeText={setTelefone}
                  />
                </View>
              </View>

              {/* Segunda linha: CPF e Email */}
              <View style={[cadastroStyles.formRow, { display: isMediumScreen ? 'flex' : 'none' }]}>
                <View style={cadastroStyles.formColumn}>
                  <Input
                    label="CPF"
                    placeholder="Digite seu CPF"
                    value={cpf}
                    onChangeText={setCpf}
                  />
                </View>
                <View style={cadastroStyles.formColumn}>
                  <Input
                    label="Email"
                    placeholder="Digite seu email"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Campos em coluna única para telas menores */}
              <View style={{ display: isMediumScreen ? 'none' : 'flex', width: '100%' }}>
                <View style={{ width: '100%', marginBottom: 10 }}>
                  <Input
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChangeText={setNome}
                  />
                </View>
                <View style={{ width: '100%', marginBottom: 10 }}>
                  <Input
                    label="Telefone"
                    placeholder="Digite seu telefone"
                    value={telefone}
                    onChangeText={setTelefone}
                  />
                </View>
                <View style={{ width: '100%', marginBottom: 10 }}>
                  <Input
                    label="CPF"
                    placeholder="Digite seu CPF"
                    value={cpf}
                    onChangeText={setCpf}
                  />
                </View>
                <View style={{ width: '100%', marginBottom: 10 }}>
                  <Input
                    label="Email"
                    placeholder="Digite seu email"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Senha sempre em largura total */}
              <View style={{ width: '100%', marginBottom: 16 }}>
                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChangeText={setSenha}
                />
              </View>

              {/* Autorizações */}
              <View style={{ width: '100%', marginBottom: 16 }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
                  📋 Autorizações
                </Text>
                
                <View style={cadastroStyles.switchContainer}>
                  <Switch
                    value={aceitaProtecaoDados}
                    onValueChange={setAceitaProtecaoDados}
                    trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                    thumbColor={aceitaProtecaoDados ? colors.branco : '#f4f3f4'}
                  />
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={cadastroStyles.switchText}>
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
                
                <View style={cadastroStyles.switchContainer}>
                  <Switch
                    value={aceitaAtendimento}
                    onValueChange={setAceitaAtendimento}
                    trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                    thumbColor={aceitaAtendimento ? colors.branco : '#f4f3f4'}
                  />
                  <Text style={cadastroStyles.switchText}>
                    Autorizo o uso dos meus dados para melhorar o atendimento e experiência
                  </Text>
                </View>
                
                <View style={cadastroStyles.switchContainer}>
                  <Switch
                    value={aceitaMarketing}
                    onValueChange={setAceitaMarketing}
                    trackColor={{ false: '#ccc', true: colors.verdeFolha }}
                    thumbColor={aceitaMarketing ? colors.branco : '#f4f3f4'}
                  />
                  <Text style={cadastroStyles.switchText}>
                    Aceito receber ofertas e novidades por e-mail e telefone
                  </Text>
                </View>
                
                <Text style={cadastroStyles.requiredText}>
                  * Campo obrigatório para prosseguir com o cadastro
                </Text>
              </View>

              {/* Mensagem de erro */}
              {erro ? (
                <Text style={{ color: colors.vermelhoCambuci, fontSize: 13, marginTop: 6, marginBottom: 2, textAlign: 'center' }}>{erro}</Text>
              ) : null}
              
              <TouchableOpacity 
                onPress={handleRegister} 
                style={[
                  cadastroStyles.button, 
                  { 
                    backgroundColor: aceitaProtecaoDados ? colors.verdeFolha : '#ccc',
                    opacity: aceitaProtecaoDados ? 1 : 0.6
                  }
                ]} 
                activeOpacity={0.85} 
                disabled={!nome || !telefone || !cpf || !email || !senha || !aceitaProtecaoDados}
              >
                <Text style={cadastroStyles.buttonText}>
                  {aceitaProtecaoDados ? 'Registrar' : 'Aceite a política de dados'}
                </Text>
              </TouchableOpacity>
              
              {/* Link para login */}
              <TouchableOpacity onPress={() => router.push('/login')} style={{ marginTop: 16 }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>
                  Já tem conta? <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold', color: colors.amareloOuro }}>Entrar</Text>
                </Text>
              </TouchableOpacity>
            </View>
            {/* Rodapé */}
            <Text style={{ color: colors.preto, fontSize: 13, marginTop: 18, fontStyle: 'italic', textAlign: 'center' }}>
              "Aqui, cada novo cadastro é um novo amigo à mesa!"
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal da Política de Proteção de Dados */}
      <PoliticaProtecaoDados
        visible={politicaVisible}
        onClose={() => setPoliticaVisible(false)}
        tipo="usuario"
      />
    </View>
  );
};

export default Cadastro;
