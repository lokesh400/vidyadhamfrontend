import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import Loader from '../components/Loader';
import TopBar from '../components/TopBar';

export default function ProfileScreen({ route, navigation }) {
  const { user: initialUser } = route.params || {};
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeProfilePayload = (payload) => {
    if (!payload) return null;
    return payload.user || payload.student || payload.data || payload;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/me');
      if (response.ok) {
        const normalizedProfile = normalizeProfilePayload(response.data);
        setProfileData(normalizedProfile || initialUser || null);
      } else {
        setProfileData(initialUser || null);
      }
    } catch (error) {
      console.error(error);
      setProfileData(initialUser || null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      let response = await api.post('/m/auth/logout', {});
      if (!response.ok) response = await api.get('/m/auth/logout');
      if (!response.ok) response = await api.post('/auth/logout', {});
      if (!response.ok) response = await api.get('/auth/logout');
    } catch (error) {
      // Continue local logout even if server endpoint fails.
    }

    await AsyncStorage.removeItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <TopBar rightIcon="person-circle" rightIconColor="#2563EB" />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader color="#4f46e5" size={40} />
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.avatarRing}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={56} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.name}>{profileData?.name || profileData?.username || 'Student'}</Text>
              <View style={styles.rolePill}>
                <Ionicons name="shield-checkmark-outline" size={13} color="#4338CA" />
                <Text style={styles.roleLabel}>{profileData?.role?.toUpperCase() || 'STUDENT'}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Academic Profile</Text>
              <View style={styles.infoGrid}>
                <View style={[styles.infoTile, styles.infoTileSpacing]}>
                  <View style={styles.tileIconWrap}>
                    <Ionicons name="id-card-outline" size={18} color="#4F46E5" />
                  </View>
                  <Text style={styles.infoLabel}>Roll Number</Text>
                  <Text style={styles.infoValue}>{profileData?.rollNumber || profileData?.username || 'N/A'}</Text>
                </View>
                <View style={styles.infoTile}>
                  <View style={styles.tileIconWrap}>
                    <Ionicons name="school-outline" size={18} color="#4F46E5" />
                  </View>
                  <Text style={styles.infoLabel}>Batch</Text>
                  <Text style={styles.infoValue}>{profileData?.batch?.name || 'Not Assigned'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.infoRow}>
                <View style={styles.rowIconWrap}>
                  <Ionicons name="mail-outline" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profileData?.email || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.rowIconWrap}>
                  <Ionicons name="person-outline" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Username</Text>
                  <Text style={styles.infoValue}>{profileData?.username || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.rowIconWrap}>
                  <Ionicons name="call-outline" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profileData?.number ? String(profileData.number) : 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.rowIconWrap}>
                  <Ionicons name="male-female-outline" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Father Name</Text>
                  <Text style={styles.infoValue}>{profileData?.fatherName || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.rowIconWrap}>
                  <Ionicons name="heart-outline" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Mother Name</Text>
                  <Text style={styles.infoValue}>{profileData?.motherName || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.rowIconWrap}>
                  <Ionicons name="location-outline" size={18} color="#4F46E5" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{profileData?.address || 'N/A'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.logoutContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.9}>
                <View style={styles.logoutIconWrap}>
                  <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.logoutText}>Log Out</Text>
                <Ionicons name="chevron-forward" size={18} color="#FECACA" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
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
    backgroundColor: '#F3F8FF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  logoutContainer: {
    paddingHorizontal: 2,
    paddingTop: 12,
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  avatarRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DCEBFF',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: 'row',
  },
  infoTile: {
    flex: 1,
    backgroundColor: '#F8FBFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCEBFF',
    padding: 12,
  },
  infoTileSpacing: {
    marginRight: 10,
  },
  tileIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 3,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  }
});
