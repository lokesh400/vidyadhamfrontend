import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const iconImg = require('../assets/icon.png');

export default function TopBar({
  title = 'Vidya Dham Mandir Parents App',
  rightIcon = 'person-circle-outline',
  rightIconColor = '#2563EB',
  onRightPress,
}) {
  return (
    <View style={styles.navbar}>
      <View style={styles.glow} />
      <View style={styles.navLeft}>
        <Image source={iconImg} style={styles.navLogo} resizeMode="contain" />
      </View>
      <View style={styles.navCenter}>
        <Text style={styles.navTitle}>{title}</Text>
      </View>
      <TouchableOpacity
        style={styles.navRight}
        onPress={onRightPress}
        disabled={!onRightPress}
        activeOpacity={0.8}
      >
        <Ionicons name={rightIcon} size={28} color={rightIconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FBFF',
    minHeight: 56,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBFF',
  },
  glow: {
    position: 'absolute',
    top: -30,
    right: -10,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#BFDBFE',
    opacity: 0.5,
  },
  navLeft: { flex: 1, alignItems: 'flex-start' },
  navLogo: { width: 34, height: 34, borderRadius: 8 },
  navCenter: { flex: 3, alignItems: 'center' },
  navTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', letterSpacing: 0.4 },
  navRight: { flex: 1, alignItems: 'flex-end' },
});
