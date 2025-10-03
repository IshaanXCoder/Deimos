const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('zkey');
config.resolver.assetExts.push('bin');
config.resolver.assetExts.push('json');
config.resolver.assetExts.push('local');

// Add buffer polyfill for react-native-svg
config.resolver.alias = {
  ...config.resolver.alias,
  buffer: require.resolve('buffer'),
};

module.exports = config;