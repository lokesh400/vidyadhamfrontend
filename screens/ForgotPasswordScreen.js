import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import api from '../services/api';
import Loader from '../components/Loader';

const iconImg = require('../assets/icon.png');

export default function ForgotPasswordScreen({ navigation }) {
  const [rollNumber, setRollNumber] = useState('');
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

  const handleForgotPassword = async () => {
    if (!rollNumber) {
      Alert.alert('Error', 'Please enter your roll number');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/forget/reset-password', { identifier: rollNumber.trim() });
      const data = response.data;
      
      if (response.ok) {
        Alert.alert('Success', 'Password reset instructions have been sent.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      Alert.alert('Error', error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#F3F8FF" />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Image source={iconImg} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brandName}>Vidya Dham Mandir Parents App</Text>
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your roll number to reset</Text>
          
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input} 
              placeholder="Roll Number" 
              placeholderTextColor="#64748b"
              value={rollNumber} 
              onChangeText={setRollNumber} 
              autoCapitalize="none"
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleForgotPassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? <Loader color="#FFFFFF" size={24} /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F8FF',
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
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 36,
  },
  inputWrapper: {
    marginBottom: 32,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  input: { 
    backgroundColor: '#FFFFFF',
    borderWidth: 1, 
    borderColor: '#DCEBFF', 
    padding: 18, 
    borderRadius: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  button: {
    backgroundColor: '#2563EB',
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  linkText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  }
});
