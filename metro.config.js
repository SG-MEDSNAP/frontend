const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// SVG 트랜스포머 설정
config.resolver.assetExts = config.resolver.assetExts.filter(
  (e) => e !== 'svg',
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);

module.exports = withNativeWind(config, { input: './global.css' });
