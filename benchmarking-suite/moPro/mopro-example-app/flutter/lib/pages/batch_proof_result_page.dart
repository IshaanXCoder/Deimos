import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:device_info_plus/device_info_plus.dart';
import 'dart:typed_data';
import 'package:mopro_flutter/mopro_flutter.dart';
import 'package:mopro_flutter/mopro_types.dart';
import 'package:flutter/services.dart'; // Import rootBundle

import 'package:Deimos/theme/app_theme.dart';
import 'package:Deimos/models/benchmark_models.dart';
import 'package:Deimos/channels/imp1_channel.dart';

// Stage 3: Batch Proof Result Page
class BatchProofResultPage extends StatefulWidget {
  final List<BatchBenchmarkConfig> configs;
  final String framework;

  const BatchProofResultPage({
    super.key,
    required this.configs,
    required this.framework,
  });

  @override
  State<BatchProofResultPage> createState() => _BatchProofResultPageState();
}

class _BatchProofResultPageState extends State<BatchProofResultPage> {
  bool _isRunning = true;
  int _currentIndex = 0;
  final List<IndividualResult> _results = [];
  final Map<String, Uint8List> _noirVerificationKeys = {};

  // Aggregated Timing
  Duration _totalProvingTime = Duration.zero;
  Duration _totalVerificationTime = Duration.zero;
  final Stopwatch _totalExecutionStopwatch = Stopwatch();

  @override
  void initState() {
    super.initState();
    _totalExecutionStopwatch.start();
    _runNextBenchmark();
  }

  Future<void> _runNextBenchmark() async {
    if (_currentIndex >= widget.configs.length) {
      _totalExecutionStopwatch.stop();
      if (mounted) {
        setState(() {
          _isRunning = false;
        });
      }
      return;
    }

    final config = widget.configs[_currentIndex];
    final moproFlutterPlugin = MoproFlutter();
    
    try {
      // Proving
      final provingStopwatch = Stopwatch()..start();
      dynamic proofData;
      dynamic rawResult;
      
      if (config.framework == 'groth16') {
        final inputData = config.selectedInputData.values;
        final inputs = _inputDataToByteArrayJson(inputData);
        final zkeyAssetPath = _getZkeyPath(config.algorithm, config.selectedInputName);
        final proofLib = config.proofBackend == 'rapidsnark' ? ProofLib.rapidsnark : ProofLib.arkworks;
        
        debugPrint('Generating Groth16 proof for ${config.algorithm} using $zkeyAssetPath');
        final result = await moproFlutterPlugin.generateGroth16Proof(zkeyAssetPath, inputs, proofLib);
        rawResult = result;
        proofData = result?.proof;
      } else if (config.framework == 'barretenberg') {
        final (circuitPath, srsPath, onChain, vk, targetInputSize) = await _getNoirSettings(config.algorithm, config.selectedInputName);
        final List<String> noirInputs = _inputDataToNoirInput(config.selectedInputData.values, targetInputSize);
        debugPrint('Generating Barretenberg proof for ${config.algorithm} using $circuitPath');
        final result = await moproFlutterPlugin.generateBarretenbergProof(
          circuitPath, srsPath, noirInputs, onChain, vk, false
        );
        rawResult = result;
        proofData = result;
      } else if (config.framework == 'risc0') {
        int numericInput = 17;
        if (config.selectedInputData.values.isNotEmpty) {
          numericInput = int.tryParse(config.selectedInputData.values.first) ?? 17;
        }
        debugPrint('Generating RISC Zero proof for numeric input $numericInput');
        final result = await moproFlutterPlugin.generateRisc0Proof(numericInput);
        rawResult = result;
        proofData = result;
      } else if (config.framework == 'cairo') {
        debugPrint('Generating Cairo proof for SHA256');
        final inputsJson = await rootBundle.loadString('assets/cairo_input.json');
        final result = await moproFlutterPlugin.generateCairoProof("assets/cairo_sha256.json", inputsJson);
        rawResult = result;
        proofData = result;
      } else if (config.framework == 'provekit') {
        final circuitName = _getProveKitCircuitName(config.algorithm, config.selectedInputName);
        final pkpPath = 'assets/provekit/$circuitName.pkp';
        final inputToml = 'input = [${config.selectedInputData.values.map((v) => '"$v"').join(', ')}]\n';
        debugPrint('Generating ProveKit proof for $circuitName using $pkpPath');
        final result = await moproFlutterPlugin.generateProveKitProof(pkpPath, inputToml);
        rawResult = result;
        proofData = result;
      } else if (config.framework == 'imp1') {
        final circuitName = _getImp1CircuitName(config.algorithm, config.selectedInputName);
        debugPrint('Generating IMP1 proof for $circuitName');
        final result = await IMP1Channel.generateProof(circuitName: circuitName);
        rawResult = result;
        proofData = result.proof;
      }
      
      provingStopwatch.stop();
      if (proofData == null) throw Exception('Proof generation failed');

      // Verification
      final verificationStopwatch = Stopwatch()..start();
      bool isValid = false;
      
      if (config.framework == 'groth16' && rawResult != null) {
         final verifyLib = config.proofBackend == 'rapidsnark' ? ProofLib.rapidsnark : ProofLib.arkworks;
         isValid = await moproFlutterPlugin.verifyGroth16Proof(
          _getZkeyPath(config.algorithm, config.selectedInputName),
          rawResult,
          verifyLib,
        );
      } else if (config.framework == 'barretenberg' && rawResult != null) {
        final (circuitPath, _, onChain, vk, _) = await _getNoirSettings(config.algorithm, config.selectedInputName);
        isValid = await moproFlutterPlugin.verifyBarretenbergProof(circuitPath, rawResult, onChain, vk, false);
      } else if (config.framework == 'risc0' && rawResult is Risc0ProofOutput) {
        final verifyResult = await moproFlutterPlugin.verifyRisc0Proof(rawResult.receipt);
        isValid = verifyResult.isValid;
      } else if (config.framework == 'cairo' && rawResult is CairoProofOutput) {
        final verifyResult = await moproFlutterPlugin.verifyCairoProof(rawResult.proof);
        isValid = verifyResult.isValid;
      } else if (config.framework == 'provekit' && rawResult is ProveKitProofOutput) {
        final circuitName = _getProveKitCircuitName(config.algorithm, config.selectedInputName);
        final pkvPath = 'assets/provekit/$circuitName.pkv';
        final verifyResult = await moproFlutterPlugin.verifyProveKitProof(pkvPath, rawResult.proof);
        isValid = verifyResult.isValid;
      } else if (config.framework == 'imp1' && rawResult is IMP1ProofResult) {
        final circuitName = _getImp1CircuitName(config.algorithm, config.selectedInputName);
        final verifyResult = await IMP1Channel.verifyProof(
          circuitName: circuitName,
          proofData: rawResult.proof,
          publicInputs: rawResult.publicInputs,
        );
        isValid = verifyResult.isValid;
      }
      verificationStopwatch.stop();

      if (mounted) {
        setState(() {
          _results.add(IndividualResult(
            config: config,
            provingTime: provingStopwatch.elapsed,
            verificationTime: verificationStopwatch.elapsed,
            isValid: isValid,
          ));
          _totalProvingTime += provingStopwatch.elapsed;
          _totalVerificationTime += verificationStopwatch.elapsed;
          _currentIndex++;
        });
      }
      
      await Future.delayed(const Duration(milliseconds: 100));
      _runNextBenchmark();
      
    } catch (e) {
      print("Batch Error for ${config.algorithm}: $e");
      if (mounted) {
        setState(() {
          _results.add(IndividualResult(
            config: config,
            provingTime: Duration.zero,
            verificationTime: Duration.zero,
            isValid: false,
            error: e.toString(),
          ));
          _currentIndex++;
        });
      }
      _runNextBenchmark();
    }
  }

  String _getZkeyPath(String algorithm, String inputName) {
    String algoPrefix = algorithm.toLowerCase();
    if (algorithm == 'RescuePrime') algoPrefix = 'rescue-prime';
    if (algorithm == 'Blake2s256') algoPrefix = 'blake2s256';
    
    final suffix = inputName.split(' ').last;
    return "assets/groth16/zkey/${algoPrefix}_$suffix.zkey";
  }

  Future<(String, String, bool, Uint8List, int)> _getNoirSettings(String algorithm, String selectedInputName) async {
    final algorithmKey = _normalizeNoirAlgorithmKey(algorithm);
    final rawInputSize = _parseSelectedInputSize(selectedInputName);

    String assetPath;
    String srsPath;
    bool onChain;
    String? vkAssetPath;
    int targetInputSize;

    if (_isNoirBytesAlgorithm(algorithm)) {
      targetInputSize = _mapNoirByteSize(rawInputSize);
      if (algorithm == 'Pedersen') {
        assetPath = 'assets/pedersen.json';
        srsPath = 'assets/pedersen.srs';
        onChain = true;
        vkAssetPath = 'assets/pedersen.vk';
      } else {
        final baseName = '${algorithmKey}_bytes_$targetInputSize';
        assetPath = 'assets/barretenberg/$baseName.json';
        srsPath = 'assets/barretenberg/$baseName.srs';
        onChain = true;
      }
    } else if (_isNoirFieldAlgorithm(algorithm)) {
      targetInputSize = _mapNoirFieldSize(rawInputSize);
      final baseName = '${algorithmKey}_field_$targetInputSize';
      assetPath = 'assets/barretenberg/$baseName.json';
      srsPath = 'assets/barretenberg/$baseName.srs';
      onChain = algorithm != 'Poseidon';
    } else {
      targetInputSize = _mapNoirByteSize(rawInputSize);
      assetPath = 'assets/sha256.json';
      srsPath = 'assets/sha256.srs';
      onChain = true;
      vkAssetPath = 'assets/sha256.vk';
    }

    final cacheKey = '$assetPath|$srsPath|$onChain';
    final cachedKey = _noirVerificationKeys[cacheKey];
    if (cachedKey != null) {
      return (assetPath, srsPath, onChain, cachedKey, targetInputSize);
    }

    Uint8List? verificationKey;
    if (vkAssetPath != null) {
      try {
        final vkAsset = await rootBundle.load(vkAssetPath);
        verificationKey = vkAsset.buffer.asUint8List();
      } catch (e) {
        debugPrint('Error loading VK asset: $e');
      }
    }

    if (verificationKey == null) {
      final moproFlutterPlugin = MoproFlutter();
      verificationKey = await moproFlutterPlugin.getBarretenbergVerificationKey(
        assetPath,
        srsPath,
        onChain,
        false, // lowMemoryMode
      );
    }

    _noirVerificationKeys[cacheKey] = verificationKey;
    return (assetPath, srsPath, onChain, verificationKey, targetInputSize);
  }

  String _normalizeNoirAlgorithmKey(String algorithm) {
    if (algorithm == 'RescuePrime') return 'rescue_prime';
    return algorithm.toLowerCase();
  }

  bool _isNoirBytesAlgorithm(String algorithm) {
    return ['SHA256', 'Keccak256', 'Blake2', 'Blake3', 'Pedersen'].contains(algorithm);
  }

  bool _isNoirFieldAlgorithm(String algorithm) {
    return ['Poseidon', 'MiMC', 'RescuePrime', 'Anemoi'].contains(algorithm);
  }

  int _parseSelectedInputSize(String inputName) {
    final suffix = inputName.split(' ').last;
    final normalized = suffix.replaceAll('f', '');
    return int.tryParse(normalized) ?? 0;
  }

  int _mapNoirByteSize(int size) {
    if (size <= 16) return 16;
    if (size <= 32) return 32;
    if (size <= 64) return 64;
    if (size <= 128) return 128;
    if (size <= 256) return 256;
    if (size <= 512) return 512;
    return 1028;
  }

  int _mapNoirFieldSize(int size) {
    if (size <= 1) return 1;
    if (size <= 2) return 2;
    if (size <= 3) return 3;
    if (size <= 4) return 4;
    if (size <= 8) return 8;
    if (size <= 16) return 16;
    if (size <= 32) return 32;
    if (size <= 64) return 64;
    return 128;
  }

  List<String> _inputDataToNoirInput(List<String> inputData, int targetSize) {
    final paddedData = List<String>.from(inputData);
    while (paddedData.length < targetSize) {
      paddedData.add('0');
    }
    return paddedData.take(targetSize).toList();
  }

  String _getProveKitCircuitName(String algorithm, String inputName) {
    String algoPrefix = algorithm.toLowerCase();
    if (algorithm == 'RescuePrime') algoPrefix = 'rescue_prime';
    final suffix = inputName.split(' ').last;
    
    if (_isNoirBytesAlgorithm(algorithm) || algorithm == 'SHA256') {
      return "${algoPrefix}_bytes_$suffix";
    } else {
      return "${algoPrefix}_field_${suffix.replaceAll('f', '')}";
    }
  }

  String _getImp1CircuitName(String algorithm, String inputName) {
    String algoPrefix = algorithm.toLowerCase();
    if (algorithm == 'RescuePrime') algoPrefix = 'rescue-prime';
    if (algorithm == 'Blake2s256') algoPrefix = 'blake2s256';
    final suffix = inputName.split(' ').last;
    return "${algoPrefix}_$suffix";
  }

  String _inputDataToByteArrayJson(List<String> inputData) {
    return '{"in": [${inputData.map((b) => '"$b"').join(', ')}]}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Batch Results: ${widget.framework.toUpperCase()}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (_isRunning) _buildProgressCard(),
            const SizedBox(height: 16),
            _buildAggregateStats(),
            const SizedBox(height: 24),
            _buildDetailedListDropdown(),
            const SizedBox(height: 32),
            if (!_isRunning) _buildSyncButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressCard() {
    double progress = widget.configs.isEmpty ? 0 : _currentIndex / widget.configs.length;
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Text(
              'Running Batch: $_currentIndex / ${widget.configs.length}',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: progress,
              backgroundColor: AppTheme.primary.withOpacity(0.1),
              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primary),
              minHeight: 12,
              borderRadius: BorderRadius.circular(6),
            ),
            const SizedBox(height: 12),
            if (_currentIndex < widget.configs.length)
              Text(
                'Current: ${widget.configs[_currentIndex].algorithm}',
                style: const TextStyle(color: AppTheme.textSecondary),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildAggregateStats() {
    final successCount = _results.where((r) => r.isValid).length;
    final totalCount = _results.length;
    
    final avgProving = totalCount == 0 ? Duration.zero : Duration(microseconds: _totalProvingTime.inMicroseconds ~/ totalCount);
    final avgVerifying = totalCount == 0 ? Duration.zero : Duration(microseconds: _totalVerificationTime.inMicroseconds ~/ totalCount);

    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Total Time', 
                _formatDuration(_totalExecutionStopwatch.elapsed), 
                Icons.timer, 
                AppTheme.primary
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Success', 
                '$successCount / $totalCount', 
                Icons.check_circle, 
                AppTheme.success
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Avg Proving', 
                _formatDuration(avgProving), 
                Icons.speed, 
                AppTheme.accent
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Avg Verify', 
                _formatDuration(avgVerifying), 
                Icons.verified, 
                AppTheme.secondary
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 12),
            Text(
              value,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailedListDropdown() {
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: AppTheme.border)),
      child: ExpansionTile(
        title: const Text(
          'Detailed Benchmark Log',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        leading: const Icon(Icons.list_alt, color: AppTheme.primary),
        children: [
          if (_results.isEmpty)
             const Padding(
               padding: EdgeInsets.all(16.0),
               child: Text('No results yet...', style: TextStyle(color: AppTheme.textSecondary)),
             ),
          ..._results.map((res) => ListTile(
            dense: true,
            title: Text(res.config.algorithm, style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text('P: ${_formatDuration(res.provingTime)} | V: ${_formatDuration(res.verificationTime)}'),
            trailing: Icon(
              res.isValid ? Icons.check_circle : Icons.error,
              color: res.isValid ? AppTheme.success : AppTheme.danger,
              size: 20,
            ),
          )).toList(),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildSyncButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton.icon(
        onPressed: _syncAllResults,
        icon: const Icon(Icons.cloud_upload),
        label: const Text('Sync All to Cloud', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  Future<void> _syncAllResults() async {
    if (_results.isEmpty) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Starting synchronization...')),
    );

    int successCount = 0;
    final deviceInfo = await _collectDeviceInfo();

    for (final res in _results) {
      if (!res.isValid) continue;

      final success = await _sendIndividualBenchmark(res, deviceInfo);
      if (success) successCount++;
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sync complete: $successCount results uploaded.')),
      );
    }
  }

  Future<bool> _sendIndividualBenchmark(IndividualResult res, Map<String, dynamic> deviceInfo) async {
    try {
      final benchmarkData = {
        'circuit': res.config.algorithm,
        'framework': 'MoPro',
        'language': res.config.framework,
        'provingTimeMiliSeconds': res.provingTime.inMilliseconds,
        'verificationTimeMiliSeconds': res.verificationTime.inMilliseconds,
        'deviceInfo': deviceInfo,
        'proofBackend': res.config.framework == 'groth16' ? res.config.proofBackend : 'N/A',
        'customInputs': {
          res.config.selectedInputName: '[${res.config.selectedInputData.values.join(', ')}]'
        },
        'timestamp': DateTime.now().toIso8601String(),
      };

      final response = await http.post(
        Uri.parse('https://deimos-fork.onrender.com/api/benchmark-result'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(benchmarkData),
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print("Sync Error for ${res.config.algorithm}: $e");
      return false;
    }
  }

  Future<Map<String, dynamic>> _collectDeviceInfo() async {
    final deviceInfoPlugin = DeviceInfoPlugin();
    if (Platform.isAndroid) {
      final androidInfo = await deviceInfoPlugin.androidInfo;
      return {
        'platform': 'Android',
        'device': androidInfo.model,
        'manufacturer': androidInfo.manufacturer,
        'androidVersion': androidInfo.version.release,
        'androidId': androidInfo.id,
      };
    } else if (Platform.isIOS) {
      final iosInfo = await deviceInfoPlugin.iosInfo;
      return {
        'platform': 'iOS',
        'device': iosInfo.utsname.machine,
        'manufacturer': 'Apple',
        'osVersion': iosInfo.systemVersion,
        'androidId': iosInfo.identifierForVendor,
      };
    }
    return {'platform': 'Unknown'};
  }

  String _formatDuration(Duration duration) {
    if (duration.inSeconds > 0) {
      return "${(duration.inMilliseconds / 1000).toStringAsFixed(2)}s";
    }
    return "${duration.inMilliseconds}ms";
  }
}

class IndividualResult {
  final BatchBenchmarkConfig config;
  final Duration provingTime;
  final Duration verificationTime;
  final bool isValid;
  final String? error;

  IndividualResult({
    required this.config,
    required this.provingTime,
    required this.verificationTime,
    required this.isValid,
    this.error,
  });
}
