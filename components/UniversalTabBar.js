import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UniversalTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const iconMap = {
          DashboardTab: ['grid', 'grid-outline'],
          Result: ['bar-chart', 'bar-chart-outline'],
          TimeTable: ['calendar', 'calendar-outline'],
          Attendance: ['checkmark-done-circle', 'checkmark-done-circle-outline'],
          Profile: ['person', 'person-outline'],
        };
        const [activeIcon, inactiveIcon] = iconMap[route.name] || ['ellipse', 'ellipse-outline'];
        const iconName = isFocused ? activeIcon : inactiveIcon;
        const labelMap = {
          DashboardTab: 'Dashboard',
        };
        const labelText = labelMap[route.name] || route.name;

        const tintColor = isFocused ? '#2563EB' : '#94A3B8';
        const label = options.tabBarAccessibilityLabel || route.name;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[styles.tabButton, isFocused && styles.tabButtonActive]}
            activeOpacity={0.85}
          >
            <Ionicons name={iconName} size={24} color={tintColor} />
            <Text style={[styles.tabLabel, { color: tintColor }]}>{labelText}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FBFF',
    borderTopWidth: 1,
    borderTopColor: '#DCEBFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    height: Platform.OS === 'ios' ? 72 : 64,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    paddingTop: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderRadius: 14,
  },
  tabButtonActive: {
    backgroundColor: '#E6F0FF',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
  },
});
