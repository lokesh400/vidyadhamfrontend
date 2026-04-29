import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import api from '../services/api';

export default function ResultScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/marks/all');
      if (response.ok) {
        setResults(response.data?.marks || []);
      } else {
        setError(response.data?.message || 'Unable to load results.');
      }
    } catch (e) {
      setError('Unable to load results right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <TopBar title="Results" rightIcon="trophy-outline" rightIconColor="#2563EB" />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 96 }}>
        <Text style={styles.pageTitle}>Performance Snapshot</Text>
        <Text style={styles.pageSubtitle}>Your latest tests and score trend</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 32 }} />
        ) : null}

        {!loading && error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!loading && !error && results.length === 0 ? (
          <Text style={styles.emptyText}>No results found yet.</Text>
        ) : null}

        {!loading &&
          !error &&
          results.map((item) => {
            const isJee = (item.examType || '').toUpperCase() === 'JEE';
            const isNeet = (item.examType || '').toUpperCase() === 'NEET';

            let totalScored = (item.physics || 0) + (item.chemistry || 0);
            let maxTotal = (item.physicsTotal || 0) + (item.chemistryTotal || 0);

            if (isJee) {
              totalScored += item.math || 0;
              maxTotal += item.mathTotal || 0;
            } else if (isNeet) {
              totalScored += (item.botany || 0) + (item.zoology || 0);
              maxTotal += (item.botanyTotal || 0) + (item.zoologyTotal || 0);
            }

            return (
              <View style={styles.card} key={item._id}>
                <View style={styles.cardRow}>
                  <Text style={styles.examTitle}>{item.testTitle || 'Test'}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.examType || 'Exam'}</Text>
                  </View>
                </View>
                <View style={styles.subjectsWrap}>
                  <View style={styles.subjectRow}>
                    <Text style={styles.subjectName}>Physics</Text>
                    <Text style={styles.subjectMarks}>
                      {(item.physics ?? 0)} / {(item.physicsTotal ?? 0)}
                    </Text>
                  </View>
                  <View style={styles.subjectRow}>
                    <Text style={styles.subjectName}>Chemistry</Text>
                    <Text style={styles.subjectMarks}>
                      {(item.chemistry ?? 0)} / {(item.chemistryTotal ?? 0)}
                    </Text>
                  </View>
                  {isJee ? (
                    <View style={styles.subjectRow}>
                      <Text style={styles.subjectName}>Math</Text>
                      <Text style={styles.subjectMarks}>
                        {(item.math ?? 0)} / {(item.mathTotal ?? 0)}
                      </Text>
                    </View>
                  ) : null}
                  {isNeet ? (
                    <>
                      <View style={styles.subjectRow}>
                        <Text style={styles.subjectName}>Botany</Text>
                        <Text style={styles.subjectMarks}>
                          {(item.botany ?? 0)} / {(item.botanyTotal ?? 0)}
                        </Text>
                      </View>
                      <View style={styles.subjectRow}>
                        <Text style={styles.subjectName}>Zoology</Text>
                        <Text style={styles.subjectMarks}>
                          {(item.zoology ?? 0)} / {(item.zoologyTotal ?? 0)}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </View>
                <View style={styles.scoreRow}>
                  <Ionicons name="stats-chart-outline" size={16} color="#2563EB" />
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.scoreText}>
                    {totalScored} <Text style={styles.totalText}>/ {maxTotal}</Text>
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F8FF' },
  container: { flex: 1, backgroundColor: '#F3F8FF', paddingHorizontal: 20, paddingTop: 18 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  pageSubtitle: { marginTop: 6, marginBottom: 20, color: '#475569', fontSize: 15 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  examTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1, marginRight: 10 },
  badge: { backgroundColor: '#E6F0FF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: '#2563EB', fontWeight: '700', fontSize: 12 },
  subjectsWrap: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  subjectName: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  subjectMarks: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  scoreRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  totalLabel: { marginLeft: 8, color: '#2563EB', fontSize: 14, fontWeight: '700' },
  scoreText: { marginLeft: 8, color: '#0F172A', fontSize: 18, fontWeight: '800' },
  totalText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#64748B', fontSize: 15 },
  errorText: { textAlign: 'center', marginTop: 30, color: '#DC2626', fontSize: 15, fontWeight: '600' },
});
