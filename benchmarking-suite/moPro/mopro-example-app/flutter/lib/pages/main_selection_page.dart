import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import '../models/input_data.dart';
import '../theme/app_theme.dart';
import 'proof_result_page.dart';

class MainSelectionPage extends StatefulWidget {
  const MainSelectionPage({super.key});

  @override
  State<MainSelectionPage> createState() => _MainSelectionPageState();
}

class _MainSelectionPageState extends State<MainSelectionPage> {
  // Selection state
  String? _selectedFramework;
  String? _selectedAlgorithm;
  String? _selectedInput;
  bool _isLoading = false;
  bool _isLoadingInputs = true;
  
  List<InputData> _availableInputs = [];
  final List<InputData> _bytesInputs = [];
  final List<InputData> _fieldInputsNoir = [];
  final List<InputData> _fieldInputsCircom = [];

  @override
  void initState() {
    super.initState();
    _loadInputs();
  }

  Future<void> _loadInputs() async {
    try {
      // Load Bytes inputs
      final byteSizes = ['16', '32', '64', '128', '256', '512', '1028'];
      for (var size in byteSizes) {
        try {
          final inputData = await _loadInputFromJson(
            'inputs/bytes/input$size.json',
            name: 'Input $size',
            description: '$size bytes input',
          );
          _bytesInputs.add(inputData);
        } catch (e) {
          debugPrint('Error loading inputs/bytes/input$size.json: $e');
        }
      }

      // Load Field inputs for Barretenberg
      final fieldSizesNoir = ['1f', '2f', '3f', '5f', '9f', '17f', '34f'];
      for (var size in fieldSizesNoir) {
        try {
          final inputData = await _loadInputFromJson(
            'inputs/field_elements/input$size.json',
            name: 'Input $size',
            description: '$size field elements input',
          );
          _fieldInputsNoir.add(inputData);
        } catch (e) {
          debugPrint('Error loading inputs/field_elements/input$size.json: $e');
        }
      }

      // Load Field inputs for Groth16
      final fieldSizesCircom = ['16f', '32f', '64f', '128f'];
      for (var size in fieldSizesCircom) {
        try {
          final inputData = await _loadInputFromJson(
            'inputs/field_elements/input$size.json',
            name: 'Input $size',
            description: '$size field elements input',
          );
          _fieldInputsCircom.add(inputData);
        } catch (e) {
          debugPrint('Error loading inputs/field_elements/input$size.json: $e');
        }
      }
      
      if (!mounted) return;
      setState(() {
        _isLoadingInputs = false;
      });
    } catch (e) {
      debugPrint('Error loading inputs: $e');
      if (!mounted) return;
      setState(() {
        _isLoadingInputs = false;
      });
    }
  }

  Future<InputData> _loadInputFromJson(String assetPath, {String? name, String? description}) async {
    try {
      final String jsonString = await rootBundle.loadString(assetPath);
      final Map<String, dynamic> jsonData = json.decode(jsonString);
      
      final String finalName = name ?? (jsonData['name'] as String? ?? 'Unknown');
      final String finalDescription = description ?? (jsonData['description'] as String? ?? '');
      final List<dynamic> inArray = jsonData['in'] as List<dynamic>;
      
      final List<String> values = inArray.map((e) => e.toString()).toList();
      
      return InputData(
        name: finalName,
        description: finalDescription,
        values: values,
      );
    } catch (e) {
      throw Exception('Failed to load input from $assetPath: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingInputs) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('DEIMOS'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 48),
              _buildSection(
                'Framework',
                'Select the zero-knowledge framework',
                _buildFrameworkSelection(),
              ),
              const SizedBox(height: 24),
              _buildSection(
                'Circuit',
                'Choose the cryptographic circuit',
                _buildAlgorithmSelection(),
                isEnabled: _selectedFramework != null,
              ),
              const SizedBox(height: 24),
              _buildSection(
                'Input',
                'Configure performance parameters',
                _buildInputSelection(),
                isEnabled: _selectedAlgorithm != null,
              ),
              const SizedBox(height: 64),
              _buildRunButton(),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Benchmark Suite',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        const SizedBox(height: 8),
        Text(
          'Analyze zero-knowledge proof performance on-device.',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }

  Widget _buildSection(String title, String subtitle, Widget child, {bool isEnabled = true}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: AppTheme.primary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppTheme.darkTextSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 16),
        Opacity(
          opacity: isEnabled ? 1.0 : 0.4,
          child: IgnorePointer(
            ignoring: !isEnabled,
            child: child,
          ),
        ),
      ],
    );
  }

  Widget _buildFrameworkSelection() {
    final frameworks = [
      {'name': 'Groth16', 'value': 'groth16', 'icon': Icons.bolt},
      {'name': 'Barretenberg', 'value': 'barretenberg', 'icon': Icons.layers},
      {'name': 'RISC Zero', 'value': 'risc0', 'icon': Icons.memory},
      {'name': 'Cairo', 'value': 'cairo', 'icon': Icons.draw},
      {'name': 'IMP1', 'value': 'imp1', 'icon': Icons.auto_awesome},
      {'name': 'ProveKit', 'value': 'provekit', 'icon': Icons.verified_user},
    ];

    return _buildCustomDropdown<String>(
      value: _selectedFramework,
      hint: 'Select Framework',
      items: frameworks.map((f) => DropdownMenuItem<String>(
        value: f['value'] as String,
        child: Row(
          children: [
            Icon(f['icon'] as IconData, size: 18, color: AppTheme.darkTextSecondary),
            const SizedBox(width: 12),
            Text(f['name'] as String),
          ],
        ),
      )).toList(),
      onChanged: (val) {
        setState(() {
          _selectedFramework = val;
          _selectedAlgorithm = null;
          _selectedInput = null;
        });
      },
    );
  }

  Widget _buildAlgorithmSelection() {
    final algorithms = _selectedFramework != null ? _getAlgorithmsForFramework(_selectedFramework!) : <String>[];
    
    return _buildCustomDropdown<String>(
      value: _selectedAlgorithm,
      hint: 'Select Circuit',
      items: algorithms.map((algo) => DropdownMenuItem<String>(
        value: algo,
        child: Text(algo),
      )).toList(),
      onChanged: (val) {
        setState(() {
          _selectedAlgorithm = val;
          _updateAvailableInputs();
        });
      },
    );
  }

  Widget _buildInputSelection() {
    return _buildCustomDropdown<String>(
      value: _selectedInput,
      hint: 'Select Input Size',
      items: _availableInputs.map((input) => DropdownMenuItem<String>(
        value: input.name,
        child: Text(input.name),
      )).toList(),
      onChanged: (val) {
        setState(() {
          _selectedInput = val;
        });
      },
    );
  }

  Widget _buildCustomDropdown<T>({
    required T? value,
    required String hint,
    required List<DropdownMenuItem<T>> items,
    required ValueChanged<T?> onChanged,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.darkBorder),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<T>(
          value: value,
          hint: Text(hint, style: const TextStyle(color: AppTheme.darkTextSecondary)),
          isExpanded: true,
          icon: const Icon(Icons.expand_more, color: AppTheme.darkTextSecondary),
          dropdownColor: AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(12),
          items: items,
          onChanged: onChanged,
        ),
      ),
    );
  }

  Widget _buildRunButton() {
    final canRun = _selectedFramework != null && _selectedAlgorithm != null && _selectedInput != null;
    
    return ElevatedButton(
      onPressed: (canRun && !_isLoading) ? _runBenchmark : null,
      child: _isLoading
          ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            )
          : const Text('INITIALIZE BENCHMARK'),
    );
  }

  void _updateAvailableInputs() {
    if (_selectedAlgorithm == null) {
      _availableInputs = [];
      _selectedInput = null;
      return;
    }

    final bytesAlgorithms = ['SHA256', 'Keccak256', 'Blake2s256', 'Blake3', 'Pedersen', 'Blake2'];
    
    if (bytesAlgorithms.contains(_selectedAlgorithm)) {
      if (_selectedFramework == 'groth16' || _selectedFramework == 'imp1') {
        final allowed = ['Input 16', 'Input 32', 'Input 64', 'Input 128'];
        _availableInputs = _bytesInputs.where((input) => allowed.contains(input.name)).toList();
      } else {
        _availableInputs = _bytesInputs;
      }
    } else {
      if (_selectedFramework == 'barretenberg') {
        _availableInputs = _fieldInputsNoir;
      } else if (_selectedFramework == 'groth16') {
        _availableInputs = _fieldInputsCircom;
      } else if (_selectedFramework == 'provekit') {
        _availableInputs = _fieldInputsNoir;
      } else {
        _availableInputs = _fieldInputsCircom;
      }
    }

    if (_availableInputs.isNotEmpty) {
      _selectedInput = _availableInputs.first.name;
    } else {
      _selectedInput = null;
    }
  }

  List<String> _getAlgorithmsForFramework(String framework) {
    switch (framework) {
      case 'groth16':
      case 'imp1':
        return ['SHA256', 'Keccak256', 'Blake2s256', 'Blake3', 'MiMC256', 'Pedersen', 'Poseidon', 'RescuePrime'];
      case 'barretenberg':
        return ['SHA256', 'Keccak256', 'Poseidon', 'MiMC', 'Blake2', 'Blake3', 'RescuePrime', 'Anemoi'];
      case 'risc0':
        return ['Factor'];
      case 'cairo':
        return ['SHA256'];
      case 'provekit':
        return ['Anemoi', 'MiMC', 'Poseidon', 'RescuePrime'];
      default:
        return [];
    }
  }

  void _runBenchmark() async {
    if (_selectedFramework == null || _selectedAlgorithm == null || _selectedInput == null) return;

    setState(() {
      _isLoading = true;
    });

    await Future.delayed(const Duration(milliseconds: 100));

    if (!mounted) return;

    final inputData = _availableInputs.firstWhere((input) => input.name == _selectedInput);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProofResultPage(
          framework: _selectedFramework!,
          algorithm: _selectedAlgorithm!,
          selectedInputName: _selectedInput!,
          selectedInputData: inputData,
        ),
      ),
    ).then((_) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }
}
