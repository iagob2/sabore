import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { indexStyles } from '../style/indexStyles';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { colors } from '../style/colors';

const IndexEmpresas = () => {
  const router = useRouter();

  const handleCadastroEmpresa = () => {
    router.push('/cadastrarEmpresa');
  };

  return (
    <>
      <Header logo="Saborê" />
      <ScrollView style={{ flex: 1, backgroundColor: colors.branco }} contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
        {/* Banner */}
        <View style={{ width: '100%', alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ color: colors.verdeFolha, fontSize: 32, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' }}>
            Sua empresa no Saborê
          </Text>
          <Text style={{ color: colors.preto, fontSize: 18, marginBottom: 28, textAlign: 'center', maxWidth: 500 }}>
            Cadastre seu restaurante ou negócio e aumente sua visibilidade para milhares de amantes da boa comida! 
            Alcance novos clientes, gerencie seu perfil e faça parte do marketplace brasileiro que valoriza todos os sabores.
          </Text>
          <View style={{ width: '100%', maxWidth: 600, aspectRatio: 3/1, borderRadius: 16, overflow: 'hidden', marginBottom: 8, backgroundColor: colors.branco, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../assets/banner-sabore.png')}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          </View>
        </View>

        {/* Benefícios */}
        <View style={{ marginBottom: 40, width: '100%', maxWidth: 600 }}>
          <Text style={{ color: colors.amareloOuro, fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Por que cadastrar sua empresa?</Text>
          <Text style={{ color: colors.preto, fontSize: 16, marginBottom: 6 }}>• Mais visibilidade para seu restaurante</Text>
          <Text style={{ color: colors.preto, fontSize: 16, marginBottom: 6 }}>• Novos clientes todos os dias</Text>
          <Text style={{ color: colors.preto, fontSize: 16, marginBottom: 6 }}>• Gestão fácil do seu perfil</Text>
          <Text style={{ color: colors.preto, fontSize: 16, marginBottom: 6 }}>• Destaque entre os melhores do marketplace brasileiro</Text>
        </View>

        {/* Restaurantes de Sucesso */}
        <View style={{ width: '100%', maxWidth: 700, marginBottom: 48 }}>
          <Text style={{ color: colors.vermelhoCambuci, fontSize: 22, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' }}>
            Restaurantes de Sucesso
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Image
                source={require('../assets/restaurante1.png')}
                style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 8, resizeMode: 'cover' }}
              />
              <Text style={{ color: colors.marromFeijao, fontWeight: 'bold', fontSize: 16 }}>Brasil Brasileiro</Text>
              <Text style={{ color: colors.preto, fontSize: 14, textAlign: 'center', maxWidth: 200 }}>
                "Aumentamos em 40% nosso movimento após entrar no Saborê!"
              </Text>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Image
                source={require('../assets/restaurante2.png')}
                style={{ width: 220, height: 120, borderRadius: 12, marginBottom: 8, resizeMode: 'cover' }}
              />
              <Text style={{ color: colors.marromFeijao, fontWeight: 'bold', fontSize: 16 }}>Cozinha da Mãe</Text>
              <Text style={{ color: colors.preto, fontSize: 14, textAlign: 'center', maxWidth: 200 }}>
                "O app trouxe muitos novos clientes fiéis para o nosso restaurante."
              </Text>
            </View>
          </View>
        </View>

        {/* Chamada para ação */}
        <TouchableOpacity onPress={handleCadastroEmpresa} style={{ backgroundColor: colors.verdeFolha, paddingVertical: 18, paddingHorizontal: 48, borderRadius: 10, marginBottom: 32 }}>
          <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 20 }}>Quero cadastrar minha empresa</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default IndexEmpresas; 