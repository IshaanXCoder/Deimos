import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mopro_flutter/mopro_flutter_method_channel.dart';
import 'package:mopro_flutter/mopro_types.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const channel = MethodChannel('mopro_flutter');
  MethodCall? receivedCall;

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (call) async {
      receivedCall = call;
      return {
        'proof': {
          'a': {'x': '1', 'y': '2', 'z': '3'},
          'b': {
            'x': ['1', '2'],
            'y': ['3', '4'],
            'z': ['5', '6'],
          },
          'c': {'x': '3', 'y': '4', 'z': '5'},
          'protocol': 'groth16',
          'curve': 'bn128',
        },
        'inputs': ['3', '5'],
      };
    });
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, null);
  });

  test('encodes Groth16 request and decodes proof response', () async {
    final result = await MethodChannelMoproFlutter().generateGroth16Proof(
      'zkey',
      '{"a":["3"]}',
      ProofLib.arkworks,
    );

    expect(receivedCall?.method, 'generateGroth16Proof');
    expect(receivedCall?.arguments, {
      'zkeyPath': 'zkey',
      'inputs': '{"a":["3"]}',
      'proofLib': ProofLib.arkworks.index,
    });
    expect(result?.inputs, ['3', '5']);
    expect(result?.proof.a.x, '1');
  });
}
