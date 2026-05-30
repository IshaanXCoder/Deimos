// data.jsx — mock data for the Deimos app

const FRAMEWORKS = [
  { id: 'arkworks',    name: 'Arkworks',    lang: 'Rust',     icon: 'shield',   type: 'DSL',   desc: 'Rust ZK library' },
  { id: 'rapidsnark',  name: 'Rapidsnark',  lang: 'C++',      icon: 'zap',      type: 'Prover',desc: 'Groth16 prover' },
  { id: 'barretenberg',name: 'Barretenberg',lang: 'C++',      icon: 'moon',     type: 'DSL',   desc: 'Aztec backend' },
  { id: 'risczero',    name: 'RISC Zero',   lang: 'Rust',     icon: 'grid',     type: 'zkVM',  desc: 'General-purpose zkVM' },
  { id: 'cairo',       name: 'Cairo',       lang: 'Cairo',    icon: 'layers',   type: 'zkVM',  desc: 'Starknet zkVM' },
  { id: 'imp1',        name: 'IMP1',        lang: 'Rust',     icon: 'flame',    type: 'Prover',desc: 'Experimental prover' },
  { id: 'provekit',    name: 'ProveKit',    lang: 'Rust',     icon: 'shield',   type: 'DSL',   desc: 'Universal toolkit' },
  { id: 'noir',        name: 'Noir',        lang: 'Noir',     icon: 'code',     type: 'DSL',   desc: 'Aztec DSL' },
  { id: 'circom',      name: 'Circom',      lang: 'Circom',   icon: 'hash',     type: 'DSL',   desc: 'Circuit DSL' },
];

const CIRCUITS = [
  { id: 'sha256',      name: 'SHA256',      icon: 'hash',     family: 'Hash' },
  { id: 'keccak256',   name: 'Keccak256',   icon: 'hash',     family: 'Hash' },
  { id: 'blake2s256',  name: 'Blake2s256',  icon: 'hash',     family: 'Hash' },
  { id: 'blake3',      name: 'Blake3',      icon: 'hash',     family: 'Hash' },
  { id: 'mimc256',     name: 'MiMC256',     icon: 'key',      family: 'Arithmetic' },
  { id: 'pedersen',    name: 'Pedersen',    icon: 'key',      family: 'Commitment' },
  { id: 'poseidon',    name: 'Poseidon',    icon: 'star',     family: 'Arithmetic' },
  { id: 'poseidon2',   name: 'Poseidon2',   icon: 'star',     family: 'Arithmetic' },
  { id: 'rescueprime', name: 'RescuePrime', icon: 'sparkles', family: 'Arithmetic' },
  { id: 'eddsa',       name: 'EdDSA',       icon: 'lock',     family: 'Signature' },
];

const INPUTS = ['Input 1f','Input 2f','Input 3f','Input 5f','Input 9f','Input 17f','Input 34f'];

const INPUT_DATA = '[140616301272610142895843444144382385239884486862111703000622123388222234316831]';

const PROOF_SAMPLE = `Poseidon2 Proof: ProofCalldata(
  a: G1Point(
    x: 7337726845191331363077140096154,
    y: 1577059911190700346124337473824,
    z: 1,
  ),
  b: G2Point(
    x: [1517615162146551115629903619..],
    y: [1856027431975443139895913488..],
    z: [1, 0],
  ),
  c: G1Point(
    x: 3755518639124229347328478976690,
    y: 1999718639317399404186835960406,
    z: 1,
  ),
  protocol: groth16,
  curve: bn128
)
Public Signals: [56139380159588730199...]
Framework: arkworks
Algorithm: Poseidon2
Timestamp: 1776574058024`;

// History runs
const HISTORY = [
  { id: 'r9', fw: 'arkworks',    circuit: 'Poseidon2',   input: 'Input 1f',  gen: 163, ver: 16,  total: 179,  date: 'Today, 10:17', status: 'ok' },
  { id: 'r8', fw: 'barretenberg',circuit: 'Poseidon2',   input: 'Input 1f',  gen: 1710,ver: 80,  total: 1790, date: 'Today, 10:02', status: 'ok' },
  { id: 'r7', fw: 'arkworks',    circuit: 'Poseidon',    input: 'Input 2f',  gen: 1280,ver: 70,  total: 1350, date: 'Today, 09:41', status: 'ok' },
  { id: 'r6', fw: 'arkworks',    circuit: 'MiMC256',     input: 'Input 1f',  gen: 690, ver: 70,  total: 760,  date: 'Yesterday',     status: 'ok' },
  { id: 'r5', fw: 'barretenberg',circuit: 'RescuePrime', input: 'Input 3f',  gen: 1980,ver: 70,  total: 2050, date: 'Yesterday',     status: 'ok' },
  { id: 'r4', fw: 'barretenberg',circuit: 'Blake2',      input: 'Input 1f',  gen: 4630,ver: 70,  total: 4700, date: 'Apr 17',        status: 'ok' },
  { id: 'r3', fw: 'arkworks',    circuit: 'RescuePrime', input: 'Input 1f',  gen: 950, ver: 80,  total: 1030, date: 'Apr 17',        status: 'ok' },
  { id: 'r2', fw: 'risczero',    circuit: 'SHA256',      input: 'Input 5f',  gen: null,ver: null,total: null, date: 'Apr 16',        status: 'fail' },
  { id: 'r1', fw: 'imp1',        circuit: 'Poseidon2',   input: 'Input 1f',  gen: 1720,ver: 60,  total: 1780, date: 'Apr 16',        status: 'ok' },
];

// Compare table rows (for Run All feature)
const COMPARE = [
  { fw: 'arkworks',    gen: 163,  ver: 16,  total: 179,  mem: 4.04, proof: 3.59, rank: 1 },
  { fw: 'rapidsnark',  gen: 210,  ver: 22,  total: 232,  mem: 5.10, proof: 3.71, rank: 2 },
  { fw: 'barretenberg',gen: 1710, ver: 80,  total: 1790, mem: 48.2, proof: 4.12, rank: 3 },
  { fw: 'risczero',    gen: 6400, ver: 120, total: 6520, mem: 96.5, proof: 48.2, rank: 4 },
  { fw: 'cairo',       gen: 3900, ver: 95,  total: 3995, mem: 52.0, proof: 28.1, rank: 5 },
];

const DEVICE_INFO = {
  model: 'SM-M315F',
  manufacturer: 'Samsung',
  os: 'Android 12',
  id: 'SP1A.210812.016',
  ram: '5.44 GB',
  peak: '5.34 GB',
  consumed: '4.04 MB',
  peakLoad: '98.1%',
  cores: 8,
  chipset: 'Mediatek Helio G80',
  batteryBefore: 45,
  batteryAfter: 45,
};

window.DATA = { FRAMEWORKS, CIRCUITS, INPUTS, INPUT_DATA, PROOF_SAMPLE, HISTORY, COMPARE, DEVICE_INFO };
