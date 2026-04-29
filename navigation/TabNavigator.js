import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UniversalTabBar from '../components/UniversalTabBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route }) {
  // Pass the user param down to tabs if needed
  const { user } = route.params || {};

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <UniversalTabBar {...props} />}
      screenOptions={() => ({
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
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
