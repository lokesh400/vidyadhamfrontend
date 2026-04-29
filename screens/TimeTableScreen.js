import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import api from '../services/api';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimeTableScreen() {
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimeTable();
  }, []);

  const normalizeTimeTable = (payload) => {
    let weekList = [];

    if (Array.isArray(payload)) {
      weekList = payload;
    } else if (Array.isArray(payload?.timetable)) {
      weekList = payload.timetable;
    } else if (Array.isArray(payload?.data)) {
      weekList = payload.data;
    } else if (Array.isArray(payload?.timetable?.timetable)) {
      weekList = payload.timetable.timetable;
    }

    if (!Array.isArray(weekList)) return [];

    return weekList.map((dayItem, dayIndex) => ({
      id: dayItem?._id || `${dayItem?.day || 'day'}-${dayIndex}`,
      day: dayItem?.day || `Day ${dayIndex + 1}`,
      dayOff: !!(dayItem?.dayOff || dayItem?.isOff),
      periods: Array.isArray(dayItem?.periods)
        ? dayItem.periods.map((p, pIndex) => ({
            id: p?._id || `${dayItem?.day || 'day'}-${pIndex}`,
            subject: p?.subject || 'Free Slot',
            teacher: p?.teacher || '-',
            startTime: p?.startTime || '--:--',
            endTime: p?.endTime || '--:--',
          }))
        : [],
    }));
  };

  const fetchTimeTable = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/timetable/timetable/mine');
      if (response.ok) {
        setWeekSchedule(normalizeTimeTable(response.data));
      } else {
        setWeekSchedule([]);
        setError(response.data?.message || 'Unable to load timetable');
      }
    } catch (e) {
      setWeekSchedule([]);
      setError('Unable to load timetable right now');
    } finally {
      setLoading(false);
    }
  };

  const sortedSchedule = useMemo(() => {
    return [...weekSchedule].sort((a, b) => {
      const ai = DAY_ORDER.indexOf(a.day);
      const bi = DAY_ORDER.indexOf(b.day);
      const safeAi = ai === -1 ? 999 : ai;
      const safeBi = bi === -1 ? 999 : bi;
      return safeAi - safeBi;
    });
  }, [weekSchedule]);

  const totalPeriods = sortedSchedule.reduce((sum, d) => sum + d.periods.length, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <TopBar title="Time Table" rightIcon="calendar-outline" rightIconColor="#2563EB" />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 96 }}>
        <Text style={styles.pageTitle}>Weekly Schedule</Text>
        <Text style={styles.pageSubtitle}>Batch-wise classes for your entire week</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active Days</Text>
          <Text style={styles.summaryValue}>{sortedSchedule.length}</Text>
          <Text style={styles.summaryMeta}>{totalPeriods} total periods scheduled</Text>
        </View>

        {loading ? <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 28 }} /> : null}
        {!loading && error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && sortedSchedule.length === 0 ? (
          <Text style={styles.emptyText}>No timetable available for your batch.</Text>
        ) : null}

        {!loading &&
          !error &&
          sortedSchedule.map((dayItem) => (
            <View style={styles.dayCard} key={dayItem.id}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{dayItem.day}</Text>
                {dayItem.dayOff ? (
                  <View style={[styles.badge, styles.offBadge]}>
                    <Text style={[styles.badgeText, styles.offBadgeText]}>Off Day</Text>
                  </View>
                ) : (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{dayItem.periods.length} periods</Text>
                  </View>
                )}
              </View>

              {dayItem.dayOff ? (
                <Text style={styles.offDayText}>No classes scheduled (day off).</Text>
              ) : dayItem.periods.length === 0 ? (
                <Text style={styles.noPeriodText}>No classes scheduled.</Text>
              ) : (
                dayItem.periods.map((period, index) => (
                  <View style={styles.periodRow} key={period.id}>
                    <View style={styles.periodIndex}>
                      <Text style={styles.periodIndexText}>{index + 1}</Text>
                    </View>
                    <View style={styles.periodMain}>
                      <Text style={styles.subject}>{period.subject}</Text>
                      <Text style={styles.teacher}>{period.teacher}</Text>
                    </View>
                    <View style={styles.timeWrap}>
                      <Ionicons name="time-outline" size={13} color="#2563EB" />
                      <Text style={styles.timeText}>{period.startTime} - {period.endTime}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F8FF' },
  container: { flex: 1, backgroundColor: '#F3F8FF', paddingHorizontal: 20, paddingTop: 18 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  pageSubtitle: { marginTop: 6, marginBottom: 16, color: '#475569', fontSize: 15 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryLabel: { color: '#475569', fontWeight: '700', fontSize: 13 },
  summaryValue: { marginTop: 6, color: '#0F172A', fontWeight: '800', fontSize: 28 },
  summaryMeta: { marginTop: 3, color: '#2563EB', fontWeight: '600', fontSize: 13 },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dayTitle: { color: '#0F172A', fontSize: 17, fontWeight: '800' },
  badge: { backgroundColor: '#E6F0FF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: '#2563EB', fontSize: 11, fontWeight: '700' },
  offBadge: { backgroundColor: '#DCFCE7' },
  offBadgeText: { color: '#15803D' },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF2FF',
  },
  periodIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  periodIndexText: { color: '#2563EB', fontSize: 11, fontWeight: '800' },
  periodMain: { flex: 1, paddingRight: 8 },
  subject: { color: '#0F172A', fontSize: 14, fontWeight: '700' },
  teacher: { color: '#64748B', fontSize: 12, marginTop: 2 },
  timeWrap: { flexDirection: 'row', alignItems: 'center' },
  timeText: { color: '#2563EB', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  noPeriodText: { color: '#64748B', fontSize: 13, fontStyle: 'italic', marginTop: 4 },
  offDayText: { color: '#15803D', fontSize: 13, fontStyle: 'italic', marginTop: 4, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#64748B', marginTop: 22, fontSize: 14 },
  errorText: { textAlign: 'center', color: '#B91C1C', marginTop: 22, fontSize: 14, fontWeight: '700' },
});
