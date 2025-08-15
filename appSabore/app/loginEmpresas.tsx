import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ImageBackground, ScrollView } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import ActionButton from '../components/ActionButton';
import { indexStyles } from '../style/indexStyles';
import { useRouter } from 'expo-router';
import { loginRestaurante } from '../api/restaurante';

const logoApp = require('../assets/logo-sabore.png');
const sashimiBanner = require('../assets/banner-sabore.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const isLargeScreen = SCREEN_WIDTH > 700;

const LoginEmpresas = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setErro('');
    setIsLoggingIn(true);
    try {
      const restauranteLogado = await loginRestaurante({ email, senha });
      console.log('Restaurante logado com sucesso:', restauranteLogado);
      
      // Navegar para gerenciaEmpresa passando o ID do restaurante
      router.push({
        pathname: '/gerenciaEmpresa',
        params: { 
          id: restauranteLogado.id.toString(),
          // Passando dados como string para evitar problemas de serialização
          restauranteData: JSON.stringify(restauranteLogado)
        }
      });
    } catch (e: any) {
      setErro(e?.message || 'Falha no login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F3' }}>
      <Header logo="Saborê" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{
          flex: 1,
          flexDirection: isLargeScreen ? 'row' : 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
          minHeight: '100%',
          marginTop: 24,
        }}>
          {/* Coluna Esquerda: Banner com logo centralizado */}
          <View style={{
            width: isLargeScreen ? '50%' : '100%',
            minWidth: isLargeScreen ? 400 : '100%',
            maxWidth: isLargeScreen ? 600 : '100%',
            height: isLargeScreen ? 500 : 220,
            alignItems: 'center',
            justifyContent: 'center',
            display: isLargeScreen ? 'flex' : 'none',
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
                  borderColor: '#1B4022', // verde-folha
                  backgroundColor: '#F5F5F3',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#1B4022',
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                  elevation: 8,
                }}>
                  <Image source={logoApp} style={{ width: 150, height: 150, borderRadius: 75, resizeMode: 'contain' }} />
                </View>
              </View>
            </ImageBackground>
          </View>
          {/* Coluna Direita: Formulário */}
          <View style={{
            width: isLargeScreen ? '50%' : '100%',
            minWidth: isLargeScreen ? 400 : '100%',
            maxWidth: isLargeScreen ? 600 : '100%',
            height: isLargeScreen ? 500 : undefined,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            backgroundColor: '#F5F5F3',
          }}>
            {/* Frase temática fora do card */}
            <Text style={{
              color: '#C99E10', // amarelo-ouro
              fontSize: 15,
              fontStyle: 'italic',
              marginTop: 20,
              marginBottom: 10,
              textAlign: 'center',
              maxWidth: 320,
              fontWeight: 'bold',
            }}>
              "Sua empresa no marketplace mais brasileiro do Brasil."
            </Text>
            <View style={{
              width: '100%',
              maxWidth: 340,
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              padding: 14,
              shadowColor: '#1B4022', // verde-folha
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 6,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#C99E10', // amarelo-ouro
            }}>
              <Text style={{
                color: '#C62828', // vermelho-cambuci
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                Login Empresarial
              </Text>
              <View style={{ width: '100%', marginBottom: 10 }}>
              <Input
                label="E-mail"
                placeholder="Digite o e-mail da empresa"
                value={email}
                onChangeText={setEmail}
              />
              </View>
              <View style={{ width: '100%', marginBottom: 10 }}>
                <Input
                  label="Senha"
                  placeholder="Digite a senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                />
              </View>
              {/* Mensagem de erro */}
              {erro ? (
                <Text style={{ color: '#C62828', fontSize: 13, marginTop: 6, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>{erro}</Text>
              ) : null}
              <ActionButton
                text="Entrar"
                onPress={handleLogin}
                variant="primary"
                style={{
                  width: '100%',
                  marginTop: 12,
                  backgroundColor: '#1B4022', // verde-folha
                  borderColor: '#C99E10', // amarelo-ouro
                  opacity: email && senha && !isLoggingIn ? 1 : 0.6,
                }}
                disabled={!email || !senha || isLoggingIn}
              />
              {/* Link para cadastro de empresa */}
              <TouchableOpacity onPress={() => router.push('/cadastrarEmpresa')} style={{ marginTop: 16 }}>
                <Text style={{ color: '#1B4022', fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>
                  Não tem conta empresarial? <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold', color: '#C99E10' }}>Cadastre sua empresa</Text>
                </Text>
              </TouchableOpacity>
            </View>
            {/* Rodapé */}
            <Text style={{ color: '#4B2E05', fontSize: 13, marginTop: 18, fontStyle: 'italic', textAlign: 'center' }}>
              Sabor brasileiro, sucesso garantido!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginEmpresas;
