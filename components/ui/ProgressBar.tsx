import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color,
  height = 8,
}: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const progressColor = color || colors.primary;

  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color: colors.mutedForeground }]}>
              {Math.round(progress * 100)}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: colors.muted, height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: progressColor,
              height,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '400',
  },
  track: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});

