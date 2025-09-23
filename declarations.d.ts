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
