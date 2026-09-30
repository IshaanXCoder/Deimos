import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Base URL is configured per-environment at build time, e.g.
  //   flutter run --dart-define=BENCHMARK_API_BASE_URL=https://api.example.com
  // A release must be built with an HTTPS backend URL. No plaintext fallback.
  static const String _baseUrl = String.fromEnvironment(
    'BENCHMARK_API_BASE_URL',
    defaultValue: '',
  );

  static bool get isConfigured => Uri.tryParse(_baseUrl)?.scheme == 'https' &&
      Uri.tryParse(_baseUrl)?.host.isNotEmpty == true;

  static const String benchmarkEndpoint = '$_baseUrl/api/benchmark-result';
  static const String benchmarkBatchEndpoint = '$_baseUrl/api/benchmark-results';

  static Future<bool> sendBenchmarkData(Map<String, dynamic> benchmarkData) async {
    if (!isConfigured) return false;
    try {
      print('=== Sending Data to Backend ===');
      
      final response = await http.post(
        Uri.parse(benchmarkEndpoint),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(benchmarkData),
      );

      print('=== Backend Response ===');
      print('Status Code: ${response.statusCode}');
      print('Response Body: ${response.body}');
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✓ Data successfully sent to backend');
        return true;
      } else {
        print('✗ Failed to send data: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('✗ Error sending data to backend: $e');
      return false;
    }
  }

  /// Sends many benchmark results in a single request. Returns a summary map
  /// `{inserted, skipped, total}` on success, or null on failure.
  static Future<Map<String, dynamic>?> sendBenchmarkBatch(
      List<Map<String, dynamic>> results) async {
    if (!isConfigured) return null;
    try {
      print('=== Sending Batch (${results.length}) to Backend ===');
      final response = await http
          .post(
            Uri.parse(benchmarkBatchEndpoint),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'results': results}),
          )
          .timeout(const Duration(seconds: 30));

      print('=== Backend Response ===');
      print('Status Code: ${response.statusCode}');
      print('Response Body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      print('✗ Error sending batch to backend: $e');
      return null;
    }
  }
}
