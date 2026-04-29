import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import api from '../services/api';

export default function DashboardScreen({ route, navigation }) {
  const { user } = route.params || {};
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const normalizeNotices = (payload) => {
    const list = payload?.notices || payload?.data || payload || [];
    if (!Array.isArray(list)) return [];

    return list.map((n, idx) => ({
      id: n?._id || `notice-${idx}`,
      title: n?.title || n?.subject || 'Notice',
      message: n?.message || n?.description || n?.content || '-',
      createdAt: n?.createdAt || n?.date || null,
    }));
  };

  const fetchNotices = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      // Primary endpoint for class-specific notices of logged-in student.
      let response = await api.get('/noticeboard/mine');
      // Backward-compatible fallback endpoint.
      if (!response.ok) {
        response = await api.get('/noticeboard/mine');
      }

      if (response.ok) {
        setNotices(normalizeNotices(response.data));
      } else {
        setNotices([]);
        setError(response.data?.message || 'Unable to load notices');
      }
    } catch (e) {
      setNotices([]);
      setError('Unable to load notices right now');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <TopBar onRightPress={() => navigation.navigate('Profile')} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchNotices(true)} tintColor="#2563EB" />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Noticeboard</Text>
          <Text style={styles.subtitle}>
            {user?.username || user?.email || 'Student'} · Class Updates
          </Text>
        </View>

        <View style={styles.focusCard}>
          <View style={styles.focusIconWrap}>
            <Ionicons name="sparkles-outline" size={18} color="#2563EB" />
          </View>
          <View style={styles.focusTextWrap}>
            <Text style={styles.focusTitle}>Today Focus</Text>
            <Text style={styles.focusText}>Stay consistent. Small daily effort compounds into big rank improvement.</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 28 }} />
        ) : null}

        {!loading && error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && notices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No Notices Yet</Text>
            <Text style={styles.emptyText}>No class notice is available right now.</Text>
          </View>
        ) : null}

        {!loading && !error && notices.length > 0 ? (
          <View style={styles.noticeBoardCard}>
            <View style={styles.noticeHead}>
              <Text style={styles.noticeHeadTitle}>All Notices</Text>
              <Text style={styles.noticeHeadMeta}>{notices.length}</Text>
            </View>
            <ScrollView
              style={styles.noticeScroll}
              contentContainerStyle={{ paddingBottom: 8 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {notices.map((notice) => (
                <View style={styles.noticeCard} key={notice.id}>
                  <View style={styles.noticeAccent} />
                  <View style={styles.noticeTopRow}>
                    <Text style={styles.noticeTitle}>{notice.title}</Text>
                    {notice.createdAt ? (
                      <View style={styles.noticeDateChip}>
                        <Text style={styles.noticeDateChipText}>
                          {new Date(notice.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.noticeMessage}>{notice.message}</Text>
                  {notice.createdAt ? (
                    <Text style={styles.noticeDate}>
                      {new Date(notice.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
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
    backgroundColor: '#F3F8FF',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  focusCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  focusTextWrap: { flex: 1 },
  focusTitle: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '800',
  },
  focusText: {
    marginTop: 3,
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  noticeBoardCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  noticeHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  noticeHeadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  noticeHeadMeta: {
    backgroundColor: '#E6F0FF',
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  noticeScroll: {
    maxHeight: 360,
  },
  noticeCard: {
    backgroundColor: '#F8FBFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  noticeAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#2563EB',
  },
  noticeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 6,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    paddingRight: 10,
    flex: 1,
  },
  noticeDateChip: {
    backgroundColor: '#EAF2FF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noticeDateChipText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
  },
  noticeMessage: {
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
    paddingLeft: 6,
  },
  noticeDate: {
    marginTop: 10,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    paddingLeft: 6,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#B91C1C',
    fontWeight: '700',
    fontSize: 14,
  },
});
