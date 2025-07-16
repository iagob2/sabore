
import React, { useState } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import HorizontalCardCarousel from '../components/HorizontalCardCarousel';
import { toast } from '../hooks/use-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { indexStyles } from '../style/indexStyles';
import { useRouter } from 'expo-router';
import { colors } from '../style/colors';

const logoApp = require('../assets/logo-sabore.png');

const Index = () => {
  const [name, setName] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const router = useRouter();

  // Dados dos restaurantes
  const cardData = [
    {
      id: '1',
      imageUrl: require('../assets/restaurante1.png'),
      name: 'Brasil Brasileiro',
      rating: 4.9,
      subtitle: 'A melhor moqueca da cidade'
    },
    {
      id: '2',
      imageUrl: require('../assets/restaurante2.png'),
      name: 'Cozinha da Mãe',
      rating: 4.8,
      subtitle: 'O melhor acarajé da cidade'
    },
    {
      id: '3',
      imageUrl: require('../assets/rest1.png'),
      name: 'Sashimi Express',
      rating: 4.7,
      subtitle: 'Sashimis frescos e delivery rápido'
    }
  ];

  const handleCardClick = (id: string) => {
    const card = cardData.find(c => c.id === id);
    toast({
      title: "Prato Selecionado",
      description: `Você escolheu: ${card?.name}`,
    });
  };

  function abrirCarrinho() {
    console.log('Carrinho atual:', carrinho);
    router.push('/carrinho');
  }

  return (
    <View style={indexStyles.main}>
      <Header 
        logo="Japones APP" 
        cartItemCount={carrinho.length}
        onCartPress={abrirCarrinho}
      />
      <ToastContainer />
      <ScrollView style={indexStyles.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Banner */}
        <View style={indexStyles.bannerContainer}>
          <Image source={require('../assets/banner-sabore.png')} style={indexStyles.banner} />
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}>
            <View style={{
              width: 290,
              height: 290,
              borderRadius: 140,
              borderWidth: 3,
              borderColor: colors.marromFeijao, // era #650C0C
              backgroundColor: colors.branco, // era #F5F5F3
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.marromFeijao, // era #650C0C
              shadowOpacity: 0.18,
              shadowRadius: 12,
              elevation: 8,
            }}>
              <Image source={logoApp} style={{ width: 270, height: 270, borderRadius: 130, resizeMode: 'cover' }} />
            </View>
          </View>
        </View>
        {/* Carrossel de Cards */}
        <View style={indexStyles.carouselSection}>
          <Text style={indexStyles.carouselTitle}>Melhores Avaliados</Text>
          <HorizontalCardCarousel 
            cards={cardData}
            onCardClick={handleCardClick}
          />
        </View>
      
        {/* Seção Institucional */}
        <View style={{ marginTop: 48, alignItems: 'center', paddingHorizontal: 12 }}>
          <Text style={[indexStyles.carouselTitle, { fontSize: 22 }]}>Sobre o Saborê</Text>
          <Text style={{ color: colors.preto, fontSize: 16, textAlign: 'center', maxWidth: 600, marginBottom: 24 }}>
            O Saborê nasceu para conectar apaixonados por sabor especial aos melhores restaurantes e experiências gastronômicas. Nossa missão é facilitar o acesso, promover a cultura e valorizar os estabelecimentos que fazem do Brasil um sabor inesquecível.
          </Text>
        </View>

        {/* Mapa do Site */}
        <View style={{ marginTop: 16, marginBottom: 32, alignItems: 'center' }}>
          <Text style={indexStyles.subtitle}>Mapa do Site</Text>
          <Text style={indexStyles.textSmall}>• Home</Text>
          <Text style={indexStyles.textSmall}>• Login</Text>
          <Text style={indexStyles.textSmall}>• Cadastro</Text>
          <Text
            style={indexStyles.textLink}
            onPress={() => router.push('/indexEmpresas')}
          >
            • Empresas
          </Text>
          <Text style={indexStyles.textSmall}>• Contato</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
