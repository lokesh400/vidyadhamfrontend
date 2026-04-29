import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

export default function RotatingLoader({ color = '#FFFFFF', size = 24 }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <View style={[styles.spinner, { width: size, height: size, borderRadius: size / 2, borderColor: color, borderTopColor: 'transparent' }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    borderWidth: 3,
  },
});
