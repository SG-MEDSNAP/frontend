/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */

// Expo의 기본 설정
const config = getDefaultConfig(__dirname);

// react-native-svg-transformer 설정 적용
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// SVG 설정이 반영된 config를 withNativeWind로 감싸서 최종적으로 export
module.exports = withNativeWind(config, { input: './global.css' });
