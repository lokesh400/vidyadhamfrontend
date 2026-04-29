import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResultScreen from '../screens/ResultScreen';
import TimeTableScreen from '../screens/TimeTableScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import UniversalTabBar from '../components/UniversalTabBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route }) {
  // Pass the user param down to tabs if needed
  const { user } = route.params || {};

  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      tabBar={(props) => <UniversalTabBar {...props} />}
      screenOptions={() => ({
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardScreen} 
        initialParams={{ user }} 
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Result"
        component={ResultScreen}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="TimeTable"
        component={TimeTableScreen}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user }}
      />
    </Tab.Navigator>
  );
}
