
import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Image, Animated, Easing, Platform } from 'react-native';
import { headerStyles } from '../style/headerStyles';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '../style/colors';

const logoApp = require('../assets/logo-sabore.png');

interface HeaderProps {
  logo: string;
  onLogin?: () => void;
  onRegister?: () => void;
  cartItemCount?: number;
  onCartPress?: () => void;
  minimal?: boolean;
}

const Header: React.FC<HeaderProps> = ({ logo, onLogin, onRegister, cartItemCount = 0, onCartPress, minimal }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showEmpresasMenu, setShowEmpresasMenu] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSpinAndNavigate = () => {
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      router.push('/');
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Função para aplicar hover no web
  const getBtnProps = (route: string, isDropdown?: boolean) => {
    const isActive = pathname === route;
    const isHovered = hovered === route;
    let btnStyle;
    if (isDropdown) {
      btnStyle = [{
        paddingVertical: headerStyles.btn.paddingVertical,
        paddingHorizontal: 18,
        fontSize: headerStyles.btn.fontSize,
        color: headerStyles.btn.color,
        backgroundColor: headerStyles.btn.backgroundColor,
        borderRadius: 0,
        fontWeight: headerStyles.btn.fontWeight,
        borderWidth: headerStyles.btn.borderWidth,
        borderColor: headerStyles.btn.borderColor,
        marginLeft: 0,
      }];
      if (isActive || isHovered) btnStyle.push(headerStyles.btnActive);
    } else {
      btnStyle = [headerStyles.btn];
      if (isActive || isHovered) btnStyle.push(headerStyles.btnActive);
    }
    let textStyle = (isActive || isHovered)
      ? { color: colors.branco, fontWeight: 'bold' as const }
      : { color: colors.verdeFolha, fontWeight: 'bold' as const };
    return {
      style: btnStyle,
      textStyle,
      ...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(route),
        onMouseLeave: () => setHovered(null),
      } : {})
    };
  };

  if (minimal) {
    return (
      <View style={headerStyles.header}>
        <TouchableOpacity onPress={handleSpinAndNavigate} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Animated.View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 2,
            borderColor: colors.marromFeijao, // era #650C0C
            backgroundColor: colors.branco, // era #F5F5F3
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotateY: spin }],
          }}>
            <Image source={logoApp} style={{ width: 48, height: 48, borderRadius: 24, resizeMode: 'contain' }} />
          </Animated.View>
          <Text style={{
            color: colors.verdeFolha, // era #650C0C
            fontWeight: 'bold',
            fontSize: 24,
            marginLeft: 12,
            letterSpacing: 1,
          }}>{logo}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={headerStyles.header}>
      <TouchableOpacity onPress={handleSpinAndNavigate} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Animated.View style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          borderWidth: 2,
          borderColor: colors.marromFeijao, // era #650C0C
          backgroundColor: colors.branco, // era #F5F5F3
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotateY: spin }],
        }}>
          <Image source={logoApp} style={{ width: 48, height: 48, borderRadius: 24, resizeMode: 'contain' }} />
        </Animated.View>
        <Text style={{
          color: colors.verdeFolha, // era #650C0C
          fontWeight: 'bold',
          fontSize: 24,
          marginLeft: 12,
          letterSpacing: 1,
        }}>Saborê</Text>
      </TouchableOpacity>
      <View style={headerStyles.actions}>
        <TouchableOpacity onPress={() => router.push('/')} {...getBtnProps('/')}>
          <Text style={getBtnProps('/').textStyle}>Restaurantes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')} {...getBtnProps('/login')}>
          <Text style={getBtnProps('/login').textStyle}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/cadastro')} {...getBtnProps('/cadastro')}>
          <Text style={getBtnProps('/cadastro').textStyle}>Cadastro</Text>
        </TouchableOpacity>
        {/* Menu suspenso Empresas */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            onPress={() => setShowEmpresasMenu((v) => !v)}
            style={headerStyles.btn}
            {...(Platform.OS === 'web' ? {
              onMouseEnter: () => setHovered('empresas'),
              onMouseLeave: () => setHovered(null),
            } : {})}
          >
            <Text style={{ color: colors.verdeFolha }}>Empresas ▼</Text>
          </TouchableOpacity>
          {showEmpresasMenu && (
            <View style={[headerStyles.dropdownMenu, { position: 'absolute', top: 40, right: 0, minWidth: 180, paddingVertical: 4, paddingHorizontal: 0, alignItems: 'stretch' }]}>
              <TouchableOpacity
                onPress={() => { setShowEmpresasMenu(false); router.push('/loginEmpresas'); }}
                {...getBtnProps('/loginEmpresas', true)}
              >
                <Text style={[getBtnProps('/loginEmpresas', true).textStyle]}>Login Empresas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowEmpresasMenu(false); router.push('/cadastrarEmpresa'); }}
                {...getBtnProps('/cadastrarEmpresa', true)}
              >
                <Text style={[getBtnProps('/cadastrarEmpresa', true).textStyle]}>Cadastrar Empresa</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Carrinho */}
        <TouchableOpacity onPress={onCartPress} style={headerStyles.cartButton}>
          <Text style={{ color: colors.amareloOuro, fontSize: 20 }}>🛒</Text>
          {cartItemCount > 0 && (
            <View style={headerStyles.cartBadge}>
              <Text style={headerStyles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        {onLogin && (
          <TouchableOpacity onPress={onLogin} style={headerStyles.btn}>
            <Text style={{ color: colors.verdeFolha }}>Login</Text>
          </TouchableOpacity>
        )}
        {onRegister && (
          <TouchableOpacity onPress={onRegister} style={[headerStyles.btn, headerStyles.btnRegister]}>
            <Text style={{ color: colors.verdeFolha, fontWeight: '600' }}>Register</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
