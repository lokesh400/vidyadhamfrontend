import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import TopBar from '../components/TopBar';
import api from '../services/api';

const MONTHS = [
  { key: 1, label: 'Jan' },
  { key: 2, label: 'Feb' },
  { key: 3, label: 'Mar' },
  { key: 4, label: 'Apr' },
  { key: 5, label: 'May' },
  { key: 6, label: 'Jun' },
  { key: 7, label: 'Jul' },
  { key: 8, label: 'Aug' },
  { key: 9, label: 'Sep' },
  { key: 10, label: 'Oct' },
  { key: 11, label: 'Nov' },
  { key: 12, label: 'Dec' },
];

export default function AttendanceScreen() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ presentDays: 0, absentDays: 0, attendancePercentage: 0 });

  const years = useMemo(() => {
    const current = today.getFullYear();
    return [current - 2, current - 1, current, current + 1];
  }, [today]);

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const normalizeAttendance = (payload) => {
    const rawList =
      payload?.dailyData ||
      payload?.attendance ||
      payload?.records ||
      payload?.data ||
      payload ||
      [];
    if (!Array.isArray(rawList)) return [];

    return rawList.map((item, index) => {
      const rawDate = item.date || item.day || item.attendanceDate || item.punchDate || null;
      const dateObj = rawDate ? new Date(rawDate) : null;
      const dayName = dateObj && !Number.isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { weekday: 'short' })
        : `Day ${index + 1}`;
      const dateLabel = dateObj && !Number.isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        : '-';

      const punchInRaw = item.punchIn || item.punchin || item.inTime || item.checkIn;
      const punchOutRaw = item.punchOut || item.punchout || item.outTime || item.checkOut;
      const punchIn = punchInRaw == null || punchInRaw === '' ? '--' : punchInRaw;
      const punchOut = punchOutRaw == null || punchOutRaw === '' ? '--' : punchOutRaw;
      const present = item.present ?? item.isPresent ?? (String(item.status || '').toLowerCase() === 'present');

      return {
        id: item._id || `${dateLabel}-${index}`,
        dayName,
        dateLabel,
        punchIn: String(punchIn),
        punchOut: String(punchOut),
        status: present ? 'Present' : 'Absent',
        present: !!present,
      };
    });
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/attendance?month=${month}&year=${year}`);
      if (response.ok) {
        const s = response.data?.summary || {};
        setSummary({
          presentDays: s.presentDays ?? 0,
          absentDays: s.absentDays ?? 0,
          attendancePercentage: s.attendancePercentage ?? 0,
        });
        setAttendance(normalizeAttendance(response.data));
      } else {
        setSummary({ presentDays: 0, absentDays: 0, attendancePercentage: 0 });
        setAttendance([]);
        setError(response.data?.message || 'Failed to load attendance');
      }
    } catch (e) {
      setSummary({ presentDays: 0, absentDays: 0, attendancePercentage: 0 });
      setAttendance([]);
      setError('Unable to load attendance right now');
    } finally {
      setLoading(false);
    }
  };

  const presentCount = summary.presentDays || attendance.filter((a) => a.present).length;
  const absentCount = summary.absentDays || Math.max(attendance.length - presentCount, 0);
  const totalCount = attendance.length;
  const overallPercent = summary.attendancePercentage || (totalCount ? Math.round((presentCount / totalCount) * 100) : 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <TopBar title="Attendance" rightIcon="checkmark-done-circle-outline" rightIconColor="#2563EB" />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 96 }}>
        <View style={styles.filterCard}>
          <Text style={styles.filterTitle}>Select Month & Year</Text>
          <View style={styles.pickerRow}>
            <View style={styles.pickerWrap}>
              <View style={styles.pickerHeader}>
                <Ionicons name="calendar-outline" size={13} color="#2563EB" />
                <Text style={styles.pickerLabel}>Month</Text>
              </View>
              <Picker
                selectedValue={month}
                onValueChange={(value) => setMonth(value)}
                style={styles.picker}
                mode="dropdown"
                dropdownIconColor="#2563EB"
              >
                {MONTHS.map((m) => (
                  <Picker.Item key={m.key} label={m.label} value={m.key} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerWrap}>
              <View style={styles.pickerHeader}>
                <Ionicons name="time-outline" size={13} color="#2563EB" />
                <Text style={styles.pickerLabel}>Year</Text>
              </View>
              <Picker
                selectedValue={year}
                onValueChange={(value) => setYear(value)}
                style={styles.picker}
                mode="dropdown"
                dropdownIconColor="#2563EB"
              >
                {years.map((y) => (
                  <Picker.Item key={y} label={String(y)} value={y} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.metricCard, styles.metricCardPrimary]}>
            <Text style={styles.metricLabel}>Overall</Text>
            <Text style={styles.metricValue}>{overallPercent}%</Text>
            <Text style={styles.metricHint}>Attendance</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Present</Text>
            <Text style={[styles.metricValue, styles.presentMetric]}>{presentCount}</Text>
            <Text style={styles.metricHint}>Days</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Absent</Text>
            <Text style={[styles.metricValue, styles.absentMetric]}>{absentCount}</Text>
            <Text style={styles.metricHint}>Days</Text>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Daily Log</Text>
          <Text style={styles.sectionSubtitle}>{totalCount} records</Text>
        </View>

        {loading ? <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 24 }} /> : null}
        {!loading && error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && attendance.length === 0 ? (
          <Text style={styles.emptyText}>No attendance found for selected month.</Text>
        ) : null}

        {!loading &&
          !error &&
          attendance.map((item) => (
            <View style={styles.rowCard} key={item.id}>
              <View style={styles.rowLeft}>
                <Text style={styles.subject}>{item.dayName}</Text>
                <Text style={styles.meta}>{item.dateLabel}</Text>
              </View>
              <View style={styles.timeCol}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>In</Text>
                  <Text style={styles.timeValue}>{item.punchIn}</Text>
                </View>
                <View style={styles.timeDivider} />
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Out</Text>
                  <Text style={styles.timeValue}>{item.punchOut}</Text>
                </View>
              </View>
              <View style={[styles.pill, item.present ? styles.presentPill : styles.absentPill]}>
                <Text style={[styles.pillText, item.present ? styles.presentText : styles.absentText]}>{item.status}</Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F8FF' },
  container: { flex: 1, backgroundColor: '#F3F8FF', paddingHorizontal: 20, paddingTop: 18 },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  filterTitle: { color: '#0F172A', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  pickerWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CFE3FF',
    borderRadius: 14,
    backgroundColor: '#F7FAFF',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
    shadowColor: '#BFDBFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pickerLabel: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
    marginLeft: 5,
    letterSpacing: 0.2,
  },
  picker: {
    width: '100%',
    height: 52,
    color: '#0F172A',
    backgroundColor: '#F7FAFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryLabel: { color: '#475569', fontWeight: '700', fontSize: 14 },
  summaryPercent: { marginTop: 8, color: '#0F172A', fontWeight: '800', fontSize: 34 },
  summaryMeta: { marginTop: 4, color: '#2563EB', fontWeight: '600', fontSize: 14 },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginRight: 8,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  metricCardPrimary: {
    backgroundColor: '#EFF6FF',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  metricValue: {
    marginTop: 6,
    fontSize: 23,
    color: '#0F172A',
    fontWeight: '800',
  },
  metricHint: {
    marginTop: 2,
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  presentMetric: {
    color: '#15803D',
  },
  absentMetric: {
    color: '#B91C1C',
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  rowCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCEBFF',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: { width: 74 },
  subject: { fontSize: 14, color: '#0F172A', fontWeight: '700' },
  meta: { marginTop: 2, fontSize: 11, color: '#64748B' },
  timeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginHorizontal: 6,
  },
  timeBlock: { alignItems: 'center', minWidth: 54 },
  timeDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 6,
  },
  timeLabel: { color: '#64748B', fontSize: 11, fontWeight: '600' },
  timeValue: { color: '#0F172A', fontSize: 12, fontWeight: '700', marginTop: 2 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  presentPill: { backgroundColor: '#DCFCE7' },
  absentPill: { backgroundColor: '#FEE2E2' },
  pillText: { fontWeight: '800', fontSize: 11 },
  presentText: { color: '#15803D' },
  absentText: { color: '#B91C1C' },
  emptyText: { textAlign: 'center', color: '#64748B', marginTop: 20, fontSize: 14 },
  errorText: { textAlign: 'center', color: '#B91C1C', marginTop: 20, fontSize: 14, fontWeight: '700' },
});
