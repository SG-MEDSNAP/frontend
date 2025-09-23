declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const API_BASE_URL: string;
}

declare module 'src/components/field/TimePickField' {
  export * from 'src/components/field/TimePickField.ios';
  export * from 'src/components/field/TimePickField.android';
}

import 'react-native-calendars';

declare module 'react-native-calendars' {
  import { ViewStyle } from 'react-native';

  // Theme 인터페이스에 긴 문자열 키를 직접 추가
  interface Theme {
    'stylesheet.day.basic'?: {
      base?: ViewStyle;
    };
  }
}
