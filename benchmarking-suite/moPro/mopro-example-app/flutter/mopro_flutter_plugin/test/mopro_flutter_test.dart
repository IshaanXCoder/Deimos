import 'package:flutter_test/flutter_test.dart';
import 'package:mopro_flutter/mopro_flutter_method_channel.dart';
import 'package:mopro_flutter/mopro_flutter_platform_interface.dart';
import 'package:mopro_flutter/mopro_types.dart';

void main() {
  test('method channel is the default platform implementation', () {
    expect(MoproFlutterPlatform.instance, isA<MethodChannelMoproFlutter>());
  });

  test('Groth16 proof fields survive channel serialization', () {
    final proof = Groth16ProofResult(
      ProofCalldata(
        G1Point('1', '2', '3'),
        G2Point(['1', '2'], ['3', '4'], ['5', '6']),
        G1Point('3', '4', '5'),
        'groth16',
        'bn128',
      ),
      ['3', '5'],
    );

    final restored = Groth16ProofResult.fromMap(proof.toMap());
    expect(restored.inputs, ['3', '5']);
    expect(restored.proof.b.y, ['3', '4']);
    expect(restored.proof.curve, 'bn128');
  });
}
