import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ImageBackground, ScrollView } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import ActionButton from '../components/ActionButton';
import { indexStyles } from '../style/indexStyles';
import { useRouter } from 'expo-router';
import { colors } from '../style/colors';
import { loginCliente } from '../api/cliente';
import { useAuthSession } from '../contexts/AuthContext';

const logoApp = require('../assets/logo-sabore.png');
const sashimiBanner = require('../assets/banner-sabore.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const isLargeScreen = SCREEN_WIDTH > 700;
const isMobile = SCREEN_WIDTH <= 700;

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { setSession } = useAuthSession();

  const handleLogin = async () => {
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setErro('');
    setIsLoggingIn(true);
    try {
      await loginCliente({ email, senha });
      // Marca sessão localmente (o Header também buscará /clientes/me)
      setSession({ email, useCookies: true });
      router.push('/');
    } catch (e: any) {
      setErro(e?.message || 'Falha no login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.branco }}>
      <Header logo="Saborê" />
      {isMobile ? (
        // Layout Mobile: ScrollView para melhor navegação
        <ScrollView 
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Frase temática no topo */}
          <Text style={{
            color: colors.verdeFolha,
            fontSize: 14,
            fontStyle: 'italic',
            marginBottom: 24,
            textAlign: 'center',
            paddingHorizontal: 16,
            lineHeight: 20,
            fontWeight: '600',
          }}>
            "Cozinhar é um ato de amor, partilha e brasilidade. Sabor que une histórias!"
          </Text>

          {/* Card de Login */}
          <View style={{
            width: '100%',
            backgroundColor: colors.branco,
            borderRadius: 20,
            padding: 20,
            shadowColor: colors.marromFeijao,
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
            borderWidth: 1,
            borderColor: colors.marromFeijao,
            marginBottom: 24,
          }}>
            <View style={{ width: '100%', marginBottom: 16 }}>
              <Input
                label="E-mail"
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={{ width: '100%', marginBottom: 12 }}>
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>
            
            {/* Mensagem de erro */}
            {erro ? (
              <Text style={{ 
                color: colors.vermelhoCambuci, 
                fontSize: 12, 
                marginTop: 4, 
                marginBottom: 8, 
                textAlign: 'center',
                paddingHorizontal: 8,
              }}>
                {erro}
              </Text>
            ) : null}

            <ActionButton
              text="Entrar"
              onPress={handleLogin}
              variant="primary"
              style={{
                width: '100%',
                marginTop: 8,
                marginBottom: 0,
                opacity: email && senha && !isLoggingIn ? 1 : 0.6,
              }}
              disabled={!email || !senha || isLoggingIn}
            />

            {/* Link para cadastro */}
            <TouchableOpacity 
              onPress={() => router.push('/cadastro')} 
              style={{ marginTop: 20, paddingVertical: 8 }}
            >
              <Text style={{ 
                color: colors.verdeFolha, 
                fontSize: 14, 
                textAlign: 'center', 
                fontWeight: '600',
                lineHeight: 20,
              }}>
                Não tem conta?{' '}
                <Text style={{ 
                  textDecorationLine: 'underline', 
                  fontWeight: 'bold', 
                  color: colors.amareloOuro 
                }}>
                  Cadastre-se
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé com frase */}
          <Text style={{ 
            color: colors.preto, 
            fontSize: 12, 
            marginTop: 8, 
            fontStyle: 'italic', 
            textAlign: 'center',
            paddingHorizontal: 16,
            opacity: 0.7,
          }}>
            "No Brasil, cada refeição é uma celebração!"
          </Text>
        </ScrollView>
      ) : (
        // Layout Desktop: Layout original
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          minHeight: '100%',
          marginTop: 24,
        }}>
          {/* Coluna Esquerda: Banner com logo centralizado */}
          <View style={{
            width: '50%',
            minWidth: 400,
            maxWidth: 600,
            height: 500,
            alignItems: 'center',
            justifyContent: 'center',
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
          </View>
          
          {/* Coluna Direita: Formulário */}
          <View style={{
            width: '50%',
            minWidth: 400,
            maxWidth: 600,
            height: 500,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            backgroundColor: colors.branco,
          }}>
            {/* Frase temática fora do card */}
            <Text style={{
              color: colors.verdeFolha,
              fontSize: 16,
              fontStyle: 'italic',
              marginBottom: 10,
              textAlign: 'center',
              maxWidth: 340,
              fontWeight: 'bold',
            }}>
              "Cozinhar é um ato de amor, partilha e brasilidade. Sabor que une histórias!"
            </Text>
            <View style={{
              width: '100%',
              maxWidth: 340,
              backgroundColor: colors.branco,
              borderRadius: 18,
              padding: 14,
              shadowColor: colors.marromFeijao,
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 6,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.marromFeijao,
            }}>
              <View style={{ width: '100%', marginBottom: 10 }}>
                <Input
                  label="E-mail"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={{ width: '100%', marginBottom: 10 }}>
                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                />
              </View>
              {/* Mensagem de erro */}
              {erro ? (
                <Text style={{ color: colors.vermelhoCambuci, fontSize: 13, marginTop: 6, marginBottom: 2, textAlign: 'center' }}>{erro}</Text>
              ) : null}
              <ActionButton
                text="Entrar"
                onPress={handleLogin}
                variant="primary"
                style={{
                  width: '100%',
                  marginTop: 12,
                  opacity: email && senha && !isLoggingIn ? 1 : 0.6,
                }}
                disabled={!email || !senha || isLoggingIn}
              />
              {/* Link para cadastro */}
              <TouchableOpacity onPress={() => router.push('/cadastro')} style={{ marginTop: 16 }}>
                <Text style={{ color: colors.verdeFolha, fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>
                  Não tem conta? <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold', color: colors.amareloOuro }}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </View>
            {/* Rodapé */}
            <Text style={{ color: colors.preto, fontSize: 13, marginTop: 18, fontStyle: 'italic', textAlign: 'center' }}>
              "No Brasil, cada refeição é uma celebração!"
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Login;
