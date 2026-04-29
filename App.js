import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Image, AppState } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import TabNavigator from './navigation/TabNavigator';
import api from './services/api';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');
  const [initialUser, setInitialUser] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, rotateAnim, scaleAnim]);

  useEffect(() => {
    const checkSession = async (isBootCheck = false) => {
      try {
        let response = await api.get('/check');
        if (!response.ok) {
          response = await api.get('/m/auth/check');
        }
        const sessionFlag =
          response.data?.loggedIn ??
          response.data?.isLoggedIn ??
          response.data?.isLOggedIn;

        if (response.ok && sessionFlag === true) {
          setInitialRoute('Dashboard');
          setInitialUser(response.data?.user || null);
        } else {
          setInitialRoute('Login');
          setInitialUser(null);
          if (!isBootCheck && navigationRef.isReady()) {
            navigationRef.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      } catch (error) {
        setInitialRoute('Login');
        setInitialUser(null);
        if (!isBootCheck && navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } finally {
        if (isBootCheck) setBooting(false);
      }
    };

    checkSession(true);

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        checkSession(false);
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (booting) {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['-12deg', '0deg'],
    });

    return (
      <SafeAreaProvider>
        <View style={styles.bootContainer}>
          <Animated.View
            style={[
              styles.logoWrap,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { rotate: spin }] },
            ]}
          >
            <Image source={require('./assets/icon.png')} style={styles.logo} resizeMode="contain" />
          </Animated.View>
          <Animated.Text style={[styles.bootText, { opacity: fadeAnim }]}>Vidya Dham Mandir</Animated.Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Dashboard"
            component={TabNavigator}
            initialParams={{ user: initialUser }}
          />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F8FF',
  },
  logoWrap: {
    width: 112,
    height: 112,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEBFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },
  logo: {
    width: 86,
    height: 86,
  },
  bootText: {
    marginTop: 14,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
