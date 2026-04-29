import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api';
import Loader from '../components/Loader';

const iconImg = require('../assets/icon.png');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/m/auth/login', { username: email, password });
      const data = response.data;
      
      if (response.ok) {
        navigation.navigate('Dashboard', { user: data.user || data });
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Image source={iconImg} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brandName}>Vidya Dham Mandir</Text>
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
          
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="Username" 
              placeholderTextColor="#64748b"
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none"
              keyboardType="email-address" 
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor="#64748b"
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry 
            />
          </View>
          
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? <Loader color="#FFFFFF" size={24} /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: { 
    flex: 1, 
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 24,
    marginBottom: 16,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 0.5,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#93C5FD',
    marginBottom: 36,
  },
  inputWrapper: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  input: { 
    backgroundColor: '#0B1222',
    borderWidth: 1, 
    borderColor: '#1F2A44', 
    padding: 18, 
    borderRadius: 16,
    fontSize: 16,
    color: '#f8fafc',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: '#A5B4FC',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#312E81',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#3730a3',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
