# 🔐 소셜 로그인 릴리즈 빌드 설정 가이드

## 📋 문제 상황

- ✅ **시뮬레이터/디버그 빌드**: 카카오, 구글 로그인 정상 작동
- ❌ **릴리즈 빌드 (APK)**: 카카오, 구글 로그인 실패

## 🎯 원인

디버그 빌드와 릴리즈 빌드는 **다른 키스토어로 서명**되기 때문에:

- 카카오: **키 해시**가 다름
- 구글: **SHA-1 지문**이 다름

각 플랫폼의 개발자 콘솔에 **릴리즈 빌드의 키 해시/SHA-1을 추가 등록**해야 합니다.

---

## 🔧 해결 방법

### 1️⃣ 릴리즈 APK 빌드 및 설치

```bash
# 릴리즈 APK 빌드
eas build -p android --profile production --local

# 빌드된 APK를 실제 Android 기기에 설치
# (파일 이름: build-xxxxx.apk)
```

### 2️⃣ 앱 실행 시 키 해시 자동 확인

앱을 실행하면 **LoginScreen**에서 자동으로 다음 작업이 수행됩니다:

1. **Alert 팝업**이 자동으로 표시되며 다음 정보가 출력:
   - `kakaoKeyHash`: 카카오 개발자 콘솔에 등록할 키 해시
   - `googleSHA1`: Google Cloud Console에 등록할 SHA-1 지문

2. **콘솔 로그**에서도 확인 가능:
   ```
   🔑 [KAKAO KEY HASH - Method 1]: xxxxx
   🔑 [KEY HASHES - Method 2]: [{kakaoKeyHash=xxxxx, googleSHA1=XX:XX:XX:...}]
   ```

---

## 🔑 카카오 로그인 설정

### 1. 키 해시 확인

- 앱 실행 시 표시되는 Alert에서 `kakaoKeyHash` 값을 복사

### 2. Kakao Developers Console 등록

1. https://developers.kakao.com 접속
2. **내 애플리케이션** → 앱 선택
3. **플랫폼** → **Android 플랫폼 등록 및 수정**
4. **키 해시** 섹션에서 **+ 키 해시 추가**
5. Alert에서 복사한 `kakaoKeyHash` 값을 붙여넣기
6. **저장**

### 📝 참고

- 디버그 키 해시는 그대로 유지
- 릴리즈 키 해시를 **추가**로 등록 (기존 것 삭제하지 않음)

---

## 🌐 구글 로그인 설정

### 1. SHA-1 지문 확인

- 앱 실행 시 표시되는 Alert에서 `googleSHA1` 값을 복사
- 형식: `XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX`

### 2. Google Cloud Console 등록

1. https://console.cloud.google.com/ 접속
2. 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**
4. **OAuth 2.0 클라이언트 ID** → **Android** 클라이언트 선택 또는 생성
5. **SHA-1 인증서 지문** 섹션에서 **+ SHA-1 인증서 지문 추가**
6. Alert에서 복사한 `googleSHA1` 값을 붙여넣기
7. **저장**

### 📝 참고

- 디버그 SHA-1은 그대로 유지
- 릴리즈 SHA-1을 **추가**로 등록 (기존 것 삭제하지 않음)
- **패키지 이름**: `com.qkrb8019.medsnap` (일치하는지 확인)

---

## ✅ 확인 방법

1. **카카오 개발자 콘솔**에서 키 해시가 2개 이상 등록되어 있는지 확인
2. **Google Cloud Console**에서 SHA-1이 2개 이상 등록되어 있는지 확인
3. 릴리즈 APK를 다시 설치하고 로그인 테스트

---

## 🔄 다시 빌드가 필요한 경우

만약 키스토어가 변경되거나 새로운 빌드를 만든 경우:

1. 위 과정을 반복하여 새로운 키 해시/SHA-1 확인
2. 각 개발자 콘솔에 **새로운 값 추가** 등록
3. 이전 값도 유지 (삭제하지 않음)

---

## 🆘 문제 해결

### 카카오 로그인 실패 시

- 키 해시가 정확히 등록되었는지 확인
- 앱 재시작 후 다시 시도
- Kakao SDK 버전 확인

### 구글 로그인 DEVELOPER_ERROR

- SHA-1이 정확히 등록되었는지 확인
- 패키지 이름이 일치하는지 확인 (`com.qkrb8019.medsnap`)
- OAuth 클라이언트 ID의 **애플리케이션 유형**이 **Android**인지 확인
- Google Play Services가 기기에 설치되어 있는지 확인

---

## 📝 추가 정보

### EAS Build 키스토어

- EAS는 자동으로 키스토어를 관리합니다
- `eas credentials` 명령어로 키스토어 정보 확인 가능

### 보안

- 키스토어 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `*.jks`, `*.keystore` 추가됨

### 참고 링크

- [Kakao Login Android 설정](https://developers.kakao.com/docs/latest/ko/kakaologin/android)
- [Google Sign-In Android 설정](https://developers.google.com/identity/sign-in/android/start-integrating)
- [EAS Build Configuration](https://docs.expo.dev/build/setup/)

---

## 🎉 완료!

위 단계를 모두 완료하면 릴리즈 빌드에서도 소셜 로그인이 정상적으로 작동합니다! 🚀
