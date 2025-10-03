import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Colors, FrameworkColors, AlgorithmColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const frameworkStats = [
    { name: 'Circom', color: FrameworkColors.circom, usage: 85, avgTime: 1250 },
    { name: 'Halo2', color: FrameworkColors.halo2, usage: 72, avgTime: 890 },
    { name: 'Noir', color: FrameworkColors.noir, usage: 68, avgTime: 1100 },
  ];

  const algorithmStats = [
    { name: 'SHA256', color: AlgorithmColors.sha256, complexity: 'High', constraints: '~25k' },
    { name: 'Keccak', color: AlgorithmColors.keccak, complexity: 'High', constraints: '~30k' },
    { name: 'Poseidon', color: AlgorithmColors.poseidon, complexity: 'Medium', constraints: '~8k' },
  ];

  const performanceMetrics = [
    { label: 'Fastest Proof Generation', value: '450ms', framework: 'Halo2', algorithm: 'Poseidon' },
    { label: 'Fastest Verification', value: '12ms', framework: 'Circom', algorithm: 'SHA256' },
    { label: 'Most Efficient Setup', value: '89ms', framework: 'Noir', algorithm: 'Poseidon' },
    { label: 'Best Overall Performance', value: '1.2s', framework: 'Halo2', algorithm: 'SHA256' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <Ionicons name="analytics" size={32} color={colors.primary} />
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Performance Insights
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Framework Performance
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.mutedForeground }]}>
            Comparative analysis of ZK proof frameworks
          </Text>
          
          {frameworkStats.map((framework, index) => (
            <View key={index} style={styles.frameworkItem}>
              <View style={styles.frameworkHeader}>
                <View style={styles.frameworkName}>
                  <View style={[styles.frameworkIndicator, { backgroundColor: framework.color }]} />
                  <Text style={[styles.frameworkText, { color: colors.text }]}>
                    {framework.name}
                  </Text>
                </View>
                <Text style={[styles.frameworkTime, { color: colors.primary }]}>
                  {framework.avgTime}ms avg
                </Text>
              </View>
              
              <View style={styles.usageBar}>
                <View style={[styles.usageTrack, { backgroundColor: colors.muted }]}>
                  <View
                    style={[
                      styles.usageFill,
                      {
                        backgroundColor: framework.color,
                        width: `${framework.usage}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.usageText, { color: colors.mutedForeground }]}>
                  {framework.usage}% efficiency
                </Text>
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Algorithm Complexity
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.mutedForeground }]}>
            Hash function implementation details
          </Text>
          
          {algorithmStats.map((algorithm, index) => (
            <View key={index} style={styles.algorithmItem}>
              <View style={styles.algorithmHeader}>
                <View style={styles.algorithmName}>
                  <View style={[styles.algorithmIndicator, { backgroundColor: algorithm.color }]} />
                  <Text style={[styles.algorithmText, { color: colors.text }]}>
                    {algorithm.name}
                  </Text>
                </View>
                <View style={styles.algorithmBadge}>
                  <Text style={[styles.complexityText, { color: colors.mutedForeground }]}>
                    {algorithm.complexity}
                  </Text>
                </View>
              </View>
              
              <View style={styles.algorithmDetails}>
                <View style={styles.algorithmDetail}>
                  <Ionicons name="layers-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
                    {algorithm.constraints} constraints
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Performance Records
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.mutedForeground }]}>
            Best performance metrics across all benchmarks
          </Text>
          
          {performanceMetrics.map((metric, index) => (
            <View key={index} style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text style={[styles.metricLabel, { color: colors.text }]}>
                  {metric.label}
                </Text>
                <Text style={[styles.metricValue, { color: colors.success }]}>
                  {metric.value}
                </Text>
              </View>
              <View style={styles.metricDetails}>
                <View style={styles.metricBadge}>
                  <Text style={[styles.metricBadgeText, { color: colors.mutedForeground }]}>
                    {metric.framework}
                  </Text>
                </View>
                <View style={styles.metricBadge}>
                  <Text style={[styles.metricBadgeText, { color: colors.mutedForeground }]}>
                    {metric.algorithm}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About Deimos
          </Text>
          <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>
            Deimos is a comprehensive benchmarking suite for zero-knowledge proof systems. 
            It provides performance comparisons across different frameworks (Circom, Halo2, Noir) 
            and hash functions (SHA256, Keccak, Poseidon) to help developers make informed 
            decisions about their ZK implementations.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Real-time performance measurement
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Cross-platform compatibility
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Detailed analytics and insights
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>
                Multiple ZK frameworks support
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  frameworkItem: {
    marginBottom: 20,
  },
  frameworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  frameworkName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frameworkIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  frameworkText: {
    fontSize: 16,
    fontWeight: '600',
  },
  frameworkTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  usageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  usageTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  usageFill: {
    height: '100%',
    borderRadius: 3,
  },
  usageText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 80,
  },
  algorithmItem: {
    marginBottom: 16,
  },
  algorithmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  algorithmName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  algorithmIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  algorithmText: {
    fontSize: 16,
    fontWeight: '600',
  },
  algorithmBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  complexityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  algorithmDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  algorithmDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  metricBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
});