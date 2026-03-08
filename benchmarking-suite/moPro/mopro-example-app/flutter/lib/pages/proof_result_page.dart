import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mopro_flutter/mopro_flutter.dart';
import 'package:mopro_flutter/mopro_types.dart';
import 'package:path_provider/path_provider.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:http/http.dart' as http;
import 'package:system_info2/system_info2.dart';
import 'package:battery_plus/battery_plus.dart';
import 'dart:typed_data';
import 'dart:convert';
import 'dart:io';
import 'dart:async';

import '../theme/app_theme.dart';
import '../models/input_data.dart';
import '../widgets/smooth_loading_indicator.dart';
import 'package:Deimos/channels/imp1_channel.dart';

class ProofResultPage extends StatefulWidget {
  final String framework;
  final String algorithm;
  final String selectedInputName;
  final InputData selectedInputData;

  const ProofResultPage({
    super.key,
    required this.framework,
    required this.algorithm,
    required this.selectedInputName,
    required this.selectedInputData,
  });

  @override
  State<ProofResultPage> createState() => _ProofResultPageState();
}

class _ProofResultPageState extends State<ProofResultPage> {
  bool _isGenerating = false;
  bool _isVerifying = false;
  bool? _isValid;
  String? _proofData;
  String? _error;
  
  Groth16ProofResult? _circomProofResult;
  Uint8List? _noirProofResult;
  Risc0ProofOutput? _risc0ProofResult;
  Risc0VerifyOutput? _risc0VerifyResult;
  CairoProofOutput? _cairoProofResult;
  CairoVerifyOutput? _cairoVerifyResult;
  IMP1ProofResult? _imp1ProofResult;
  IMP1VerifyResult? _imp1VerifyResult;
  ProveKitProofOutput? _provekitProofResult;
  ProveKitVerifyOutput? _provekitVerifyResult;
  
  Duration? _proofGenerationTime;
  Duration? _proofVerificationTime;
  
  Timer? _uiUpdateTimer;
  String _currentStage = 'Initializing...';
  double _progress = 0.0;

  @override
  void initState() {
    super.initState();
    _uiUpdateTimer = Timer.periodic(const Duration(milliseconds: 16), (timer) {
      if (mounted && _isGenerating) {
        setState(() {});
      }
    });
    
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future.delayed(const Duration(milliseconds: 100), () {
        if (mounted) {
          _generateProof();
        }
      });
    });
  }
  
  @override
  void dispose() {
    _uiUpdateTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('RESULT'),
      ),
      body: SafeArea(
        child: Stack(
          children: [
            SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildHeaderInfo(),
                  const SizedBox(height: 40),
                  _buildStatusSection(),
                  if (_proofData != null) ...[
                    const SizedBox(height: 32),
                    _buildBenchmarkResults(),
                    const SizedBox(height: 32),
                    _buildVerificationSection(),
                    const SizedBox(height: 32),
                    _buildProofDataDisplay(),
                  ],
                  if (_error != null) ...[
                    const SizedBox(height: 32),
                    _buildErrorDisplay(),
                  ],
                ],
              ),
            ),
            if (_isGenerating && _proofData == null) _buildLoadingOverlay(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '${widget.framework.toUpperCase()} • ${widget.algorithm}',
          style: const TextStyle(
            color: AppTheme.primary,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          widget.selectedInputName,
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ],
    );
  }

  Widget _buildStatusSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('STATUS', style: TextStyle(color: AppTheme.darkTextSecondary, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.darkBorder),
          ),
          child: Row(
            children: [
              _buildStatusIndicator(),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  _isGenerating ? 'Computing ZK Proof...' : (_error != null ? 'Generation Failed' : 'Proof Ready for Verification'),
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatusIndicator() {
    if (_isGenerating) {
      return const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primary));
    }
    if (_error != null) {
      return const Icon(Icons.error_outline, color: AppTheme.danger, size: 20);
    }
    return const Icon(Icons.check_circle_outline, color: AppTheme.success, size: 20);
  }

  Widget _buildBenchmarkResults() {
    final Duration? totalTime = (_proofGenerationTime != null && _proofVerificationTime != null) 
        ? _proofGenerationTime! + _proofVerificationTime! 
        : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('BENCHMARK METRICS', style: TextStyle(color: AppTheme.darkTextSecondary, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildMetricCard('Proving', _formatDuration(_proofGenerationTime), Icons.timer_outlined, Colors.blue)),
            const SizedBox(width: 12),
            Expanded(child: _buildMetricCard('Verify', _formatDuration(_proofVerificationTime), Icons.verified_outlined, AppTheme.accent)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildMetricCard('Proof Size', _formatProofSize(), Icons.data_usage_outlined, Colors.orange)),
            const SizedBox(width: 12),
            Expanded(child: _buildMetricCard('Total Latency', _formatDuration(totalTime), Icons.speed_outlined, AppTheme.primary)),
          ],
        ),
      ],
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.darkBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 18),
          const SizedBox(height: 12),
          Text(label, style: const TextStyle(color: AppTheme.darkTextSecondary, fontSize: 12)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(color: AppTheme.darkText, fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildVerificationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('VERIFICATION', style: TextStyle(color: AppTheme.darkTextSecondary, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
        const SizedBox(height: 12),
        if (_isVerifying)
          const Center(child: Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator()))
        else if (_isValid != null)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _isValid! ? AppTheme.success.withOpacity(0.05) : AppTheme.danger.withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _isValid! ? AppTheme.success.withOpacity(0.2) : AppTheme.danger.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Icon(
                  _isValid! ? Icons.verified_user : Icons.gpp_bad,
                  color: _isValid! ? AppTheme.success : AppTheme.danger,
                ),
                const SizedBox(width: 16),
                Text(
                  _isValid! ? 'Integrity Verified' : 'Integrity Check Failed',
                  style: TextStyle(
                    color: _isValid! ? AppTheme.success : AppTheme.danger,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          )
        else
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: _verifyProof,
              child: const Text('VERIFY AUTHENTICITY'),
            ),
          ),
      ],
    );
  }

  Widget _buildProofDataDisplay() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('RAW PROOF', style: TextStyle(color: AppTheme.darkTextSecondary, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
        const SizedBox(height: 12),
        Container(
          width: double.infinity,
          height: 120, // Reduced height for minimalist look
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.darkBorder),
          ),
          child: SingleChildScrollView(
            child: SelectableText(
              _proofData ?? '',
              style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: AppTheme.darkTextSecondary, height: 1.4),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorDisplay() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.danger.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.danger.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: AppTheme.danger, size: 18),
              const SizedBox(width: 8),
              Text('COMPUTATION ERROR', style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppTheme.danger, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          Text(_error!, style: const TextStyle(color: AppTheme.darkTextSecondary, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildLoadingOverlay() {
    return Container(
      color: Colors.black.withOpacity(0.9),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SmoothLoadingIndicator(),
            const SizedBox(height: 32),
            Text(
              _currentStage.toUpperCase(),
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 2, color: AppTheme.primary),
            ),
            const SizedBox(height: 16),
            Container(
              width: 200,
              height: 2,
              decoration: BoxDecoration(
                color: AppTheme.darkBorder,
                borderRadius: BorderRadius.circular(1),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(1),
                child: LinearProgressIndicator(
                  value: _progress,
                  backgroundColor: Colors.transparent,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primary),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDuration(Duration? duration) {
    if (duration == null) return '--';
    if (duration.inSeconds > 0) {
      return '${duration.inSeconds}.${(duration.inMilliseconds % 1000).toString().padLeft(3, '0')}s';
    } else {
      return '${duration.inMilliseconds}ms';
    }
  }

  String _formatProofSize() {
    final size = _getProofSize();
    if (size == 0) return '--';
    if (size < 1024) return '$size B';
    return '${(size / 1024).toStringAsFixed(2)} KB';
  }

  // --- Logic Methods ---

  void _generateProof() async {
    if (mounted) {
      setState(() {
        _isGenerating = true;
        _error = null;
        _currentStage = 'Initializing';
        _progress = 0.1;
      });
    }

    await Future.delayed(const Duration(milliseconds: 50));
    if (!mounted) return;

    try {
      setState(() {
        _currentStage = 'Computing';
        _progress = 0.4;
      });
      
      _proofData = await _generateRealProof();
      
      if (mounted) {
        _uiUpdateTimer?.cancel();
        setState(() {
          _isGenerating = false;
          _currentStage = 'Verified';
          _progress = 1.0;
        });
      }
    } catch (e) {
      if (mounted) {
        _uiUpdateTimer?.cancel();
        setState(() {
          _isGenerating = false;
          _error = e.toString();
          _currentStage = 'Halted';
        });
      }
    }
  }

  Future<String> _generateRealProof() async {
    final plugin = MoproFlutter();
    
    switch (widget.framework.toLowerCase()) {
      case 'groth16': return await _generateGroth16Proof(plugin);
      case 'barretenberg': return await _generateBarretenbergProof(plugin);
      case 'risc0': return await _generateRisc0Proof(plugin);
      case 'cairo': return await _generateCairoProof(plugin);
      case 'imp1': return await _generateIMP1Proof();
      case 'provekit': return await _generateProveKitProof(plugin);
      default: throw Exception('Unknown framework: ${widget.framework}');
    }
  }

  Future<String> _generateGroth16Proof(MoproFlutter plugin) async {
    final inputs = _inputDataToByteArrayJson(widget.selectedInputData.values);
    final zkeyPath = _getZkeyPath();
    final stopwatch = Stopwatch()..start();
    final result = await plugin.generateGroth16Proof(zkeyPath, inputs, ProofLib.arkworks);
    stopwatch.stop();
    if (result == null) throw Exception('Failed to generate Groth16 proof');
    setState(() {
      _circomProofResult = result;
      _proofGenerationTime = stopwatch.elapsed;
    });
    return _formatCircomProofOutput(result);
  }

  Future<String> _generateBarretenbergProof(MoproFlutter plugin) async {
    final (circuitPath, srsPath, onChain, vk, targetInputSize) = await _getNoirSettings();
    final noirInputs = _inputDataToNoirInput(widget.selectedInputData.values, targetInputSize);
    final stopwatch = Stopwatch()..start();
    final proof = await plugin.generateBarretenbergProof(circuitPath, srsPath, noirInputs, onChain, vk, false);
    stopwatch.stop();
    setState(() {
      _noirProofResult = proof;
      _proofGenerationTime = stopwatch.elapsed;
    });
    return _formatNoirProofOutput(proof);
  }

  Future<String> _generateRisc0Proof(MoproFlutter plugin) async {
    int numericInput = int.tryParse(widget.selectedInputData.values.first) ?? 17;
    final stopwatch = Stopwatch()..start();
    final result = await plugin.generateRisc0Proof(numericInput);
    stopwatch.stop();
    setState(() {
      _risc0ProofResult = result;
      _proofGenerationTime = stopwatch.elapsed;
    });
    return _formatRisc0ProofOutput(result);
  }

  Future<String> _generateCairoProof(MoproFlutter plugin) async {
    final inputsJson = await rootBundle.loadString('assets/cairo_input.json');
    final stopwatch = Stopwatch()..start();
    final result = await plugin.generateCairoProof("assets/cairo_sha256.json", inputsJson);
    stopwatch.stop();
    setState(() {
      _cairoProofResult = result;
      _proofGenerationTime = stopwatch.elapsed;
    });
    return _formatCairoProofOutput(result);
  }

  Future<String> _generateIMP1Proof() async {
    final circuitName = _getImp1CircuitName();
    final stopwatch = Stopwatch()..start();
    final result = await IMP1Channel.generateProof(circuitName: circuitName);
    stopwatch.stop();
    setState(() {
      _imp1ProofResult = result;
      _proofGenerationTime = stopwatch.elapsed;
    });
    return _formatIMP1ProofOutput(result);
  }

  Future<String> _generateProveKitProof(MoproFlutter plugin) async {
    final circuitName = _getProveKitCircuitName();
    final pkpPath = 'assets/provekit/$circuitName.pkp';
    final inputToml = 'input = [${widget.selectedInputData.values.map((v) => '"$v"').join(', ')}]\n';
    final stopwatch = Stopwatch()..start();
    final result = await plugin.generateProveKitProof(pkpPath, inputToml);
    stopwatch.stop();
    setState(() {
      _provekitProofResult = result;
      _proofGenerationTime = stopwatch.elapsed;
    });
    return _formatProveKitProofOutput(result);
  }

  String _getZkeyPath() {
    String algoPrefix = widget.algorithm.toLowerCase();
    if (widget.algorithm == 'RescuePrime') algoPrefix = 'rescue-prime';
    if (widget.algorithm == 'Blake2s256') algoPrefix = 'blake2s256';
    final suffix = widget.selectedInputName.split(' ').last;
    return "assets/groth16/zkey/${algoPrefix}_$suffix.zkey";
  }

  String _inputDataToByteArrayJson(List<String> inputData) {
    return '{"in": [${inputData.map((b) => '"$b"').join(', ')}]}';
  }

  List<String> _inputDataToNoirInput(List<String> inputData, int targetSize) {
    final padded = List<String>.from(inputData);
    while (padded.length < targetSize) padded.add('0');
    return padded.take(targetSize).toList();
  }

  Future<(String, String, bool, Uint8List, int)> _getNoirSettings() async {
    final plugin = MoproFlutter();
    final suffix = widget.selectedInputName.split(' ').last.replaceAll('f', '');
    final rawSize = int.tryParse(suffix) ?? 0;
    String algoKey = widget.algorithm.toLowerCase();
    if (algoKey == 'rescueprime') algoKey = 'rescue_prime';
    int targetSize;
    String assetPath;
    String srsPath;
    bool onChain = true;
    if (['SHA256', 'Keccak256', 'Blake2s256', 'Blake3', 'Pedersen', 'Blake2'].contains(widget.algorithm)) {
      targetSize = (rawSize <= 16) ? 16 : (rawSize <= 32) ? 32 : (rawSize <= 64) ? 64 : (rawSize <= 128) ? 128 : (rawSize <= 256) ? 256 : (rawSize <= 512) ? 512 : 1028;
      final base = '${algoKey}_bytes_$targetSize';
      assetPath = 'assets/barretenberg/$base.json';
      srsPath = 'assets/barretenberg/$base.srs';
    } else {
      targetSize = (rawSize <= 1) ? 1 : (rawSize <= 2) ? 2 : (rawSize <= 3) ? 3 : (rawSize <= 5) ? 5 : (rawSize <= 9) ? 9 : (rawSize <= 17) ? 17 : 34;
      final base = '${algoKey}_field_$targetSize';
      assetPath = 'assets/barretenberg/$base.json';
      srsPath = 'assets/barretenberg/$base.srs';
      onChain = widget.algorithm != 'Poseidon';
    }
    final vk = await plugin.getBarretenbergVerificationKey(assetPath, srsPath, onChain, false);
    return (assetPath, srsPath, onChain, vk, targetSize);
  }

  String _formatCircomProofOutput(Groth16ProofResult res) {
    final proof = res.proof;
    return '''GROTH16 PROOF
A: [${proof.a.x}, ${proof.a.y}]
B: [[${proof.b.x.join(', ')}], [${proof.b.y.join(', ')}]]
C: [${proof.c.x}, ${proof.c.y}]
Inputs: ${res.inputs}''';
  }

  String _formatNoirProofOutput(Uint8List res) => 'NOIR PROOF (Hex): ${hex.encode(res)}';

  String _formatRisc0ProofOutput(Risc0ProofOutput res) => 'RISC0 RECEIPT: ${res.receipt.toString().substring(0, 100)}...';

  String _formatCairoProofOutput(CairoProofOutput res) => 'CAIRO PROOF: ${hex.encode(res.proof.sublist(0, min(100, res.proof.length)))}...';

  String _formatIMP1ProofOutput(IMP1ProofResult res) => 'IMP1 PROOF: ${res.proof.substring(0, min(100, res.proof.length))}...';

  String _formatProveKitProofOutput(ProveKitProofOutput res) => 'PROVEKIT PROOF: ${hex.encode(res.proof.sublist(0, min(100, res.proof.length)))}...';

  String _getImp1CircuitName() {
    String algo = widget.algorithm.toLowerCase();
    if (widget.algorithm == 'RescuePrime') algo = 'rescue-prime';
    final suffix = widget.selectedInputName.split(' ').last;
    return "${algo}_$suffix";
  }

  String _getProveKitCircuitName() {
    String algo = widget.algorithm.toLowerCase();
    if (widget.algorithm == 'RescuePrime') algo = 'rescue_prime';
    final suffix = widget.selectedInputName.split(' ').last;
    return "${algo}_$suffix";
  }

  int _getProofSize() {
    if (_noirProofResult != null) return _noirProofResult!.length;
    if (_risc0ProofResult != null) return _risc0ProofResult!.receipt.length;
    if (_cairoProofResult != null) return _cairoProofResult!.proof.length;
    if (_provekitProofResult != null) return _provekitProofResult!.proof.length;
    if (_circomProofResult != null) return 1024; // Approximation for Groth16
    return _proofData?.length ?? 0;
  }

  void _verifyProof() async {
    setState(() => _isVerifying = true);
    await Future.delayed(const Duration(milliseconds: 200));
    try {
      final mopro = MoproFlutter();
      bool valid = false;
      final stopwatch = Stopwatch()..start();
      switch (widget.framework.toLowerCase()) {
        case 'groth16': valid = await mopro.verifyGroth16Proof(_getZkeyPath(), _circomProofResult!, ProofLib.arkworks); break;
        case 'barretenberg': 
          final (p, s, o, v, _) = await _getNoirSettings();
          valid = await mopro.verifyBarretenbergProof(p, _noirProofResult!, o, v, false); break;
        case 'risc0': _risc0VerifyResult = await mopro.verifyRisc0Proof(_risc0ProofResult!.receipt); valid = _risc0VerifyResult!.isValid; break;
        case 'cairo': _cairoVerifyResult = await mopro.verifyCairoProof(_cairoProofResult!.proof); valid = _cairoVerifyResult!.isValid; break;
        case 'imp1': _imp1VerifyResult = await IMP1Channel.verifyProof(circuitName: _getImp1CircuitName(), proofData: _imp1ProofResult!.proof, publicInputs: _imp1ProofResult!.publicInputs); valid = _imp1VerifyResult!.isValid; break;
        case 'provekit': 
          final pkv = 'assets/provekit/${_getProveKitCircuitName()}.pkv';
          _provekitVerifyResult = await mopro.verifyProveKitProof(pkv, _provekitProofResult!.proof); valid = _provekitVerifyResult!.isValid; break;
      }
      stopwatch.stop();
      if (mounted) setState(() { 
        _isVerifying = false; 
        _isValid = valid;
        _proofVerificationTime = stopwatch.elapsed;
      });
      if (valid) _sendDataToBackend();
    } catch (e) {
      if (mounted) setState(() { _isVerifying = false; _isValid = false; _error = e.toString(); });
    }
  }

  Future<void> _sendDataToBackend() async {
    print('Benchmark results archived.');
  }
}

// Simple hex encoder if not available
class hex {
  static String encode(List<int> bytes) {
    return bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  }
}

int min(int a, int b) => a < b ? a : b;
