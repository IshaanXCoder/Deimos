// Input data structure
class InputData {
  final String name;
  final String description;
  final List<String> values;
  
  InputData({required this.name, required this.description, required this.values});
}

// Data class for batch configuration
class BatchBenchmarkConfig {
  final String framework;
  final String algorithm;
  final String selectedInputName;
  final InputData selectedInputData;
  final String proofBackend;

  BatchBenchmarkConfig({
    required this.framework,
    required this.algorithm,
    required this.selectedInputName,
    required this.selectedInputData,
    this.proofBackend = 'arkworks',
  });
}
