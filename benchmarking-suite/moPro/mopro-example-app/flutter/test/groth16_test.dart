import 'package:Deimos/main.dart';
import 'package:Deimos/utils/circuit_registry.dart';
import 'package:Deimos/utils/circuit_utils.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('every Groth16 batch selection has a bundled proving key', () async {
    final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
    final assets = manifest.listAssets().toSet();
    final grothFrameworks = {'arkworks', 'rapidsnark', 'imp1'};

    for (final item in CircuitRegistry.getFullBenchmarkSuite()) {
      if (!grothFrameworks.contains(item.framework)) continue;
      final keyPath = CircuitUtils.getZkeyPath(item.algorithm, item.inputName);
      expect(assets, contains(keyPath), reason: '$keyPath is offered in the batch suite');
    }
    expect(assets, isNot(contains('assets/groth16/zkey/keccak256_128.zkey')));
    expect(assets, isNot(contains('assets/groth16/zkey/keccak256_32.zkey')));
  });

  testWidgets('main screen discloses automatic uploads and links the policy',
      (tester) async {
    await tester.pumpWidget(const MyApp());
    for (var attempt = 0;
        attempt < 100 && find.text('Privacy policy').evaluate().isEmpty;
        attempt++) {
      await tester.pump(const Duration(milliseconds: 50));
    }

    expect(find.text('Privacy policy'), findsOneWidget);
    expect(find.textContaining('upload automatically'), findsOneWidget);
  });
}
