import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import TopBar from '../components/TopBar';

export default function DashboardScreen({ route, navigation }) {
  const { user } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <TopBar onRightPress={() => navigation.navigate('Profile')} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.username || user?.email || 'User'}!</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Activity</Text>
            <Text style={styles.cardText}>No recent activity to show.</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F3F8FF' 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100, // accommodate modern tab bar height
    backgroundColor: '#F3F8FF',
  },
  header: {
    marginBottom: 32,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 18, 
    color: '#475569' 
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DCEBFF',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 7,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#2563EB',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
