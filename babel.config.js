module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // 빌드 시점에 환경 변수를 인라인으로 치환 (가장 먼저 실행)
      ['transform-inline-environment-variables', { include: ['API_BASE_URL'] }],
      // react-native-dotenv
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env.local',
          blocklist: null,
          allowlist: null,
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
    ],
  };
};
