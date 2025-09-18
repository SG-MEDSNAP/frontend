// 개발 모드 활성화 여부를 관리하는 플래그
export const DEV_MODE_ENABLED = true;

// 각 화면별 우회 설정
export const DEV_SETTINGS = {
  // 카메라 촬영 우회 설정
  BYPASS_CAMERA: true,
  // 약 등록 API 호출 우회 설정
  BYPASS_MEDICATION_REGISTER: true,
  // 모든 개발 기능 활성화 (true로 설정하면 위의 모든 설정이 활성화됨)
  ENABLE_ALL_BYPASSES: false,
};

// 특정 기능의 우회 상태를 확인하는 헬퍼 함수
export const isDevBypassEnabled = (setting: keyof typeof DEV_SETTINGS) => {
  return (
    DEV_MODE_ENABLED &&
    (DEV_SETTINGS[setting] || DEV_SETTINGS.ENABLE_ALL_BYPASSES)
  );
};
