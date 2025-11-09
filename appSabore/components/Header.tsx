
import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Image, Animated, Easing, Platform, useWindowDimensions, StyleSheet, StatusBar } from 'react-native';
import { headerStyles } from '../style/headerStyles';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { registerToast, toast, ToastInput } from '../hooks/use-toast';
import { getSessao, logoutCliente } from '../api/cliente';
import { useAuthSession } from '../contexts/AuthContext';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { session: sessao, setSession, clearSession } = useAuthSession();
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 400;

  const mobileStyles = StyleSheet.create({
    mobileMenuPanel: {
      width: '100%',
      backgroundColor: colors.branco,
      borderBottomWidth: 1,
      borderBottomColor: colors.marromFeijao,
      borderTopWidth: 0,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    mobileMenuItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.marromFeijao,
    },
    mobileMenuText: {
      color: colors.verdeFolha,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  // Toast Provider para web (banner simples no topo da tela)
  const [toastMsg, setToastMsg] = useState<ToastInput | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  React.useEffect(() => {
    registerToast((args) => {
      setToastMsg(args);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3200);
    });
  }, []);

	// Buscar sessão atual (web: via cookie JSESSIONID)
  const isCheckingSessionRef = React.useRef(false);
  React.useEffect(() => {
    // Evitar chamadas múltiplas e quando já há sessão
    if (sessao || isCheckingSessionRef.current) {
      return;
    }
    
    isCheckingSessionRef.current = true;
    (async () => {
      try {
        const me = await getSessao();
        if (me && me.email) {
          // Marcar que está usando cookies (Spring Security)
          setSession({ ...me, useCookies: true });
        }
      } catch (_) {
        // sessão não encontrada (401 é esperado) - silenciar
      } finally {
        isCheckingSessionRef.current = false;
      }
    })();
  }, [sessao]);

	const displayName = React.useMemo(() => {
		if (!sessao) return '';
		if (sessao.nome && sessao.nome.trim().length > 0) return sessao.nome.split(' ')[0];
		if (sessao.email) return sessao.email.split('@')[0];
		return 'Minha conta';
	}, [sessao]);

  const handleLogout = async () => {
		try {
			await logoutCliente();
      clearSession();
			setUserMenuOpen(false);
			router.push('/login');
			toast({ title: 'Você saiu da conta', type: 'success' });
		} catch (e) {
      // Mesmo em caso de 401/redirect do Spring, vamos limpar sessão local e seguir
      clearSession();
      setUserMenuOpen(false);
      router.push('/login');
      toast({ title: 'Sessão finalizada', type: 'success' });
		}
	};

  const handleSpinAndNavigate = () => {
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: Platform.OS !== 'web',
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
    <>
      {/* StatusBar para mobile */}
      {Platform.OS !== 'web' && (
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={colors.branco}
          translucent={false}
        />
      )}
      
      {/* Banner de toast no topo (web) */}
      {Platform.OS === 'web' && toastVisible && toastMsg && (
        <View style={{
          position: 'fixed' as any,
          top: 8,
          left: '50%',
          transform: [{ translateX: -180 }],
          minWidth: 280,
          maxWidth: 360,
          backgroundColor: toastMsg.type === 'error' ? '#DC2626' : toastMsg.type === 'success' ? '#16A34A' : '#1B4022',
          borderWidth: 2,
          borderColor: '#C99E10',
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 14,
          zIndex: 100000,
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)' as any,
        }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: toastMsg.description ? 4 : 0 }}>
            {toastMsg.title}
          </Text>
          {toastMsg.description ? (
            <Text style={{ color: '#fff' }}>{toastMsg.description}</Text>
          ) : null}
        </View>
      )}
      <View style={headerStyles.header}>
        <TouchableOpacity 
          onPress={handleSpinAndNavigate} 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            flexShrink: 1,
            paddingVertical: 4,
            paddingRight: 12,
          }}
        >
          <Animated.View style={{
            width: isSmallScreen ? 36 : 52,
            height: isSmallScreen ? 36 : 52,
            borderRadius: isSmallScreen ? 18 : 26,
            borderWidth: 2.5,
            borderColor: colors.marromFeijao,
            backgroundColor: colors.branco,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotateY: spin }],
            shadowColor: colors.marromFeijao,
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}>
            <Image source={logoApp} style={{ 
              width: isSmallScreen ? 28 : 44, 
              height: isSmallScreen ? 28 : 44, 
              borderRadius: isSmallScreen ? 14 : 22, 
              resizeMode: 'contain' 
            }} />
          </Animated.View>
          <Text style={{
            color: colors.verdeFolha,
            fontWeight: '700',
            fontSize: isSmallScreen ? 18 : 26,
            marginLeft: isSmallScreen ? 8 : 14,
            letterSpacing: 1.2,
          }}>Saborê</Text>
        </TouchableOpacity>

        {/* Ações - Desktop/Tablet */}
        {!isSmallScreen && (
			<View style={headerStyles.actions}>
            <TouchableOpacity onPress={() => router.push('/')} {...getBtnProps('/')}>
              <Text style={getBtnProps('/').textStyle}>Restaurantes</Text>
            </TouchableOpacity>
				{!sessao ? (
					<>
						<TouchableOpacity onPress={() => router.push('/login')} {...getBtnProps('/login')}>
							<Text style={getBtnProps('/login').textStyle}>Login</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => router.push('/cadastro')} {...getBtnProps('/cadastro')}>
							<Text style={getBtnProps('/cadastro').textStyle}>Cadastro</Text>
						</TouchableOpacity>
					</>
				) : (
					<View style={{ position: 'relative' }}>
						<TouchableOpacity
							onPress={() => setUserMenuOpen((v) => !v)}
							style={headerStyles.btn}
							{...(Platform.OS === 'web' ? {
								onMouseEnter: () => setHovered('user-menu'),
								onMouseLeave: () => setHovered(null),
							} : {})}
						>
							<Text style={{ color: colors.verdeFolha }}>{displayName} ▼</Text>
						</TouchableOpacity>
						{userMenuOpen && (
							<View style={[headerStyles.dropdownMenu, { position: 'absolute', top: 40, right: 0, minWidth: 180, paddingVertical: 4, paddingHorizontal: 0, alignItems: 'stretch' }]}> 
								<TouchableOpacity
									onPress={() => { setUserMenuOpen(false); router.push('/perfilUsuario'); }}
									{...getBtnProps('/perfilUsuario', true)}
								>
									<Text style={[getBtnProps('/perfilUsuario', true).textStyle]}>👤 Meu Perfil</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => { setUserMenuOpen(false); router.push('/pedidos'); }}
									{...getBtnProps('/pedidos', true)}
								>
									<Text style={[getBtnProps('/pedidos', true).textStyle]}>📋 Meus Pedidos</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleLogout}
									{...getBtnProps('/logout', true)}
								>
									<Text style={[getBtnProps('/logout', true).textStyle]}>🚪 Sair</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				)}
            {/* Menu suspenso Empresas (apenas em telas maiores) */}
            {/* Carrinho */}
            <TouchableOpacity 
              onPress={onCartPress} 
              style={[
                headerStyles.cartButton,
                {
                  borderWidth: 2,
                  borderColor: colors.amareloOuro,
                  backgroundColor: cartItemCount > 0 ? 'rgba(255, 179, 0, 0.1)' : 'transparent',
                }
              ]}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name="shopping-cart" 
                size={isSmallScreen ? 20 : 24} 
                color={cartItemCount > 0 ? colors.amareloOuro : colors.verdeFolha} 
              />
              {cartItemCount > 0 && (
                <View style={headerStyles.cartBadge}>
                  <Text style={headerStyles.cartBadgeText}>{cartItemCount > 99 ? '99+' : cartItemCount}</Text>
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
        )}

        {/* Botão de menu - Mobile */}
        {isSmallScreen && (
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            style={[headerStyles.btn, { marginLeft: 'auto' }]}
            accessibilityLabel="Menu"
          >
            <MaterialIcons name={menuOpen ? 'close' : 'menu'} size={22} color={colors.verdeFolha} />
          </TouchableOpacity>
        )}
      </View>

      {/* Painel do menu mobile abaixo do header */}
		{isSmallScreen && menuOpen && (
        <View style={mobileStyles.mobileMenuPanel}>
          <TouchableOpacity onPress={() => { setMenuOpen(false); router.push('/'); }} style={mobileStyles.mobileMenuItem}>
            <Text style={mobileStyles.mobileMenuText}>Restaurantes</Text>
          </TouchableOpacity>
				{!sessao ? (
					<>
						<TouchableOpacity onPress={() => { setMenuOpen(false); router.push('/login'); }} style={mobileStyles.mobileMenuItem}>
							<Text style={mobileStyles.mobileMenuText}>Login</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => { setMenuOpen(false); router.push('/cadastro'); }} style={mobileStyles.mobileMenuItem}>
							<Text style={mobileStyles.mobileMenuText}>Cadastro</Text>
						</TouchableOpacity>
					</>
				) : (
					<>
						<TouchableOpacity onPress={() => { setMenuOpen(false); router.push('/perfilUsuario'); }} style={mobileStyles.mobileMenuItem}>
							<Text style={mobileStyles.mobileMenuText}>👤 Meu Perfil</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => { setMenuOpen(false); router.push('/pedidos'); }} style={mobileStyles.mobileMenuItem}>
							<Text style={mobileStyles.mobileMenuText}>📋 Meus Pedidos</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => { setMenuOpen(false); handleLogout(); }} style={mobileStyles.mobileMenuItem}>
							<Text style={mobileStyles.mobileMenuText}>🚪 Sair</Text>
						</TouchableOpacity>
					</>
				)}
          <TouchableOpacity onPress={() => { setMenuOpen(false); onCartPress && onCartPress(); }} style={[mobileStyles.mobileMenuItem, { borderBottomWidth: 0 }]}>
            <Text style={mobileStyles.mobileMenuText}>Carrinho {cartItemCount ? `(${cartItemCount})` : ''}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Header;
