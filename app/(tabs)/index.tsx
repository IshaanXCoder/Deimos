import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreen } from '@/components/SplashScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors, FrameworkColors, AlgorithmColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface BenchmarkResult {
  framework: 'circom' | 'halo2' | 'noir';
  algorithm: 'sha256' | 'keccak' | 'poseidon';
  time: number;
  timestamp: Date;
}

const FRAMEWORKS = [
  { id: 'circom', name: 'Circom', color: FrameworkColors.circom },
  { id: 'halo2', name: 'Halo2', color: FrameworkColors.halo2 },
  { id: 'noir', name: 'Noir', color: FrameworkColors.noir },
];

const ALGORITHMS = [
  { id: 'sha256', name: 'SHA256', color: AlgorithmColors.sha256 },
  { id: 'keccak', name: 'Keccak', color: AlgorithmColors.keccak },
  { id: 'poseidon', name: 'Poseidon', color: AlgorithmColors.poseidon },
];

const INPUT_OPTIONS = [
  { id: 'small', name: 'Small (1KB)', description: 'Basic test data' },
  { id: 'medium', name: 'Medium (10KB)', description: 'Standard benchmark' },
  { id: 'large', name: 'Large (100KB)', description: 'Heavy workload test' },
  { id: 'xlarge', name: 'X-Large (1MB)', description: 'Maximum stress test' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [showSplash, setShowSplash] = useState(true);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [selectedInput, setSelectedInput] = useState<string>('medium');
  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBenchmark, setCurrentBenchmark] = useState<string>('');
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [activeTab, setActiveTab] = useState<'filters' | 'results'>('filters');

  const toggleFramework = (frameworkId: string) => {
    setSelectedFrameworks(prev =>
      prev.includes(frameworkId)
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const toggleAlgorithm = (algorithmId: string) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algorithmId)
        ? prev.filter(id => id !== algorithmId)
        : [...prev, algorithmId]
    );
  };

  const selectInput = (inputId: string) => {
    setSelectedInput(inputId);
    setShowInputDropdown(false);
  };

  const runBenchmarks = async () => {
    if (selectedFrameworks.length === 0 || selectedAlgorithms.length === 0) {
      Alert.alert('Missing Selection', 'Please select at least one framework and one algorithm.');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setActiveTab('results');

    const newResults: BenchmarkResult[] = [];
    const totalCombinations = selectedFrameworks.length * selectedAlgorithms.length;
    let currentStep = 0;

    for (const frameworkId of selectedFrameworks) {
      for (const algorithmId of selectedAlgorithms) {
        const framework = FRAMEWORKS.find(f => f.id === frameworkId);
        const algorithm = ALGORITHMS.find(a => a.id === algorithmId);

        setCurrentBenchmark(`${framework?.name} - ${algorithm?.name}`);
        setProgress(currentStep / totalCombinations);

        // Simulate benchmark execution
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        newResults.push({
          framework: frameworkId as 'circom' | 'halo2' | 'noir',
          algorithm: algorithmId as 'sha256' | 'keccak' | 'poseidon',
          time: Math.floor(100 + Math.random() * 2000),
          timestamp: new Date(),
        });

        currentStep++;
      }
    }

    setProgress(1);
    setCurrentBenchmark('');
    setResults(prev => [...prev, ...newResults]);
    setIsRunning(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const selectedInputOption = INPUT_OPTIONS.find(opt => opt.id === selectedInput);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        
      />

      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <View style={[styles.headerIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.headerIconText}>D</Text>
            </View>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Deimos</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                ZK Proof Benchmarking
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Button
          title="Filters"
          onPress={() => setActiveTab('filters')}
          variant={activeTab === 'filters' ? 'primary' : 'ghost'}
          style={styles.tabButton}
        />
        <Button
          title="Results"
          onPress={() => setActiveTab('results')}
          variant={activeTab === 'results' ? 'primary' : 'ghost'}
          style={styles.tabButton}
        />
      </View>

      {activeTab === 'filters' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.filterCard}>
            <Text style={styles.sectionTitle}>Select Frameworks</Text>
            <View style={styles.optionsContainer}>
              {FRAMEWORKS.map(framework => (
                <Pressable
                  key={framework.id}
                  onPress={() => toggleFramework(framework.id)}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: selectedFrameworks.includes(framework.id)
                        ? framework.color
                        : colors.muted,
                      borderColor: selectedFrameworks.includes(framework.id)
                        ? framework.color
                        : colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: selectedFrameworks.includes(framework.id)
                          ? '#ffffff'
                          : colors.text,
                      },
                    ]}
                  >
                    {framework.name}
                  </Text>
                  {selectedFrameworks.includes(framework.id) && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </Pressable>
              ))}
            </View>
          </Card>

          <Card style={styles.filterCard}>
            <Text style={styles.sectionTitle}>Select Algorithms</Text>
            <View style={styles.optionsContainer}>
              {ALGORITHMS.map(algorithm => (
                <Pressable
                  key={algorithm.id}
                  onPress={() => toggleAlgorithm(algorithm.id)}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: selectedAlgorithms.includes(algorithm.id)
                        ? algorithm.color
                        : colors.muted,
                      borderColor: selectedAlgorithms.includes(algorithm.id)
                        ? algorithm.color
                        : colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: selectedAlgorithms.includes(algorithm.id)
                          ? '#ffffff'
                          : colors.text,
                      },
                    ]}
                  >
                    {algorithm.name}
                  </Text>
                  {selectedAlgorithms.includes(algorithm.id) && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </Pressable>
              ))}
            </View>
          </Card>

          <Card style={styles.filterCard}>
            <Text style={styles.sectionTitle}>Select Input</Text>
            <View style={styles.inputContainer}>
              <Pressable
                onPress={() => setShowInputDropdown(!showInputDropdown)}
                style={[
                  styles.inputDropdown,
                  {
                    backgroundColor: colors.muted,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.inputDropdownContent}>
                  <View>
                    <Text style={[styles.inputDropdownTitle, { color: colors.text }]}>
                      {selectedInputOption?.name}
                    </Text>
                    <Text style={[styles.inputDropdownDescription, { color: colors.mutedForeground }]}>
                      {selectedInputOption?.description}
                    </Text>
                  </View>
                  <Ionicons
                    name={showInputDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.mutedForeground}
                  />
                </View>
              </Pressable>

              {showInputDropdown && (
                <View style={[styles.dropdownOptions, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  {INPUT_OPTIONS.map(option => (
                    <Pressable
                      key={option.id}
                      onPress={() => selectInput(option.id)}
                      style={[
                        styles.dropdownOption,
                        {
                          backgroundColor: selectedInput === option.id ? colors.primary + '20' : 'transparent',
                        },
                      ]}
                    >
                      <View>
                        <Text style={[styles.dropdownOptionTitle, { color: colors.text }]}>
                          {option.name}
                        </Text>
                        <Text style={[styles.dropdownOptionDescription, { color: colors.mutedForeground }]}>
                          {option.description}
                        </Text>
                      </View>
                      {selectedInput === option.id && (
                        <Ionicons name="checkmark" size={16} color={colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </Card>

          <Button
            title={`Run Benchmarks (${selectedFrameworks.length * selectedAlgorithms.length} selected)`}
            onPress={runBenchmarks}
            loading={isRunning}
            disabled={selectedFrameworks.length === 0 || selectedAlgorithms.length === 0}
            size="lg"
            style={styles.runButton}
          />
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isRunning && (
            <Card style={styles.progressCard}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Running Benchmarks...
              </Text>
              <Text style={[styles.progressSubtitle, { color: colors.mutedForeground }]}>
                {currentBenchmark}
              </Text>
              <ProgressBar
                progress={progress}
                label="Progress"
                color={colors.primary}
              />
            </Card>
          )}

          {results.length === 0 ? (
            <Card>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No benchmark results yet. Select filters and run benchmarks to see results here.
              </Text>
            </Card>
          ) : (
            results.map((result, index) => (
              <Card key={index} style={styles.resultCard}>
                <Text style={[styles.resultTitle, { color: colors.text }]}>
                  {result.framework.toUpperCase()} - {result.algorithm.toUpperCase()}
                </Text>
                <Text style={[styles.resultTime, { color: colors.primary }]}>
                  Time: {result.time}ms
                </Text>
                <Text style={[styles.resultDate, { color: colors.mutedForeground }]}>
                  {result.timestamp.toLocaleString()}
                </Text>
              </Card>
            ))
          )}
        </ScrollView>
      )}
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
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  filterCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  inputDropdown: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  inputDropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputDropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputDropdownDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownOption: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dropdownOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownOptionDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  runButton: {
    marginTop: 16,
    marginBottom: 20,
  },
  progressCard: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    padding: 20,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultTime: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultDate: {
    fontSize: 12,
  },
});