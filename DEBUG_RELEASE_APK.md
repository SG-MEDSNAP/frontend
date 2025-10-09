# 🐛 Release APK 카카오 로그인 디버깅 가이드

## 📱 **실제 디바이스에서 로그 확인하기**

### 1️⃣ **ADB 연결 및 로그 확인**

```bash
# 디바이스가 연결되었는지 확인
adb devices

# Release APK 설치
adb install -r build-1760028756153.apk

# 앱 실행하면서 실시간 로그 확인 (카카오 관련 로그만 필터링)
adb logcat | grep -i "kakao"

# 또는 더 넓은 범위로 확인
adb logcat | grep -E "kakao|oauth|login|auth"

# React Native 앱 로그 확인
adb logcat *:S ReactNative:V ReactNativeJS:V
```

### 2️⃣ **카카오 로그인 시도 후 전체 로그 저장**

```bash
# 로그를 파일로 저장
adb logcat > release_kakao_debug.log

# 앱에서 카카오 로그인 시도
# Ctrl+C로 중단 후 로그 파일 확인
```

---

## 🔑 **Release 키 해시 확인 및 등록**

### 방법 1: EAS 키스토어에서 직접 확인 (가장 정확!)

```bash
# 1. EAS 로그인
npx eas-cli login

# 2. Android credentials 다운로드
npx eas-cli credentials

# 선택: Android > production > Keystore > Download

# 3. 다운로드한 키스토어에서 Kakao 키 해시 생성
keytool -exportcert -alias <YOUR_ALIAS> -keystore ./build-credentials.jks \
  | openssl sha1 -binary \
  | openssl base64

# 4. Google SHA-1도 함께 확인
keytool -list -v -keystore ./build-credentials.jks
```

### 방법 2: APK에서 직접 추출

```bash
# APK의 서명 정보 확인
jarsigner -verify -verbose -certs build-1760028756153.apk

# 또는
keytool -printcert -jarfile build-1760028756153.apk
```

---

## ✅ **체크리스트**

### 1. **Kakao Developers Console 설정**

- [ ] **플랫폼 > Android**에 패키지명 `com.qkrb8019.medsnap` 등록됨
- [ ] **디버그 키 해시** 등록됨
- [ ] **릴리즈 키 해시** 등록됨 ⚠️ **가장 중요!**
- [ ] 앱 키 `4d0de224c7f89c443ef4e795ca6ec88c` 확인

### 2. **Google Cloud Console 설정** (구글 로그인용)

- [ ] Android OAuth 클라이언트 ID 생성됨
- [ ] 패키지명 `com.qkrb8019.medsnap` 등록됨
- [ ] **디버그 SHA-1** 등록됨
- [ ] **릴리즈 SHA-1** 등록됨 ⚠️ **가장 중요!**

### 3. **app.json 설정**

- [x] `@react-native-seoul/kakao-login` 플러그인 설정됨
- [x] `kakaoAppKey: "4d0de224c7f89c443ef4e795ca6ec88c"` 설정됨

### 4. **AndroidManifest.xml**

- [x] `<uses-permission android:name="android.permission.INTERNET"/>` 포함됨

### 5. **ProGuard 규칙** (필요시)

Expo 프로젝트는 기본적으로 ProGuard가 적용되지 않지만, 만약 적용되었다면:

```proguard
# Kakao SDK
-keep class com.kakao.sdk.** { *; }
-keep interface com.kakao.sdk.** { *; }
-dontwarn com.kakao.sdk.**

# React Native Seoul Kakao Login
-keep class com.reactnativeseoul.kakao.** { *; }
```

---

## 🚀 **권장 디버깅 순서**

1. **APK 설치 및 로그 확인**

   ```bash
   adb install -r build-1760028756153.apk
   adb logcat | grep -E "kakao|Kakao|KAKAO|ERROR"
   ```

2. **카카오 로그인 시도**
   - 앱에서 "카카오로 로그인" 버튼 클릭
   - 에러 메시지 확인

3. **예상되는 에러 메시지**
   - `"Android keyHash validation failed"` → 릴리즈 키 해시 미등록
   - `"KakaoSDK not initialized"` → app.json 설정 확인
   - `"App key is invalid"` → 카카오 앱 키 확인

4. **키 해시 확인 및 등록**

   ```bash
   # 현재 APK의 키 해시 확인
   keytool -printcert -jarfile build-1760028756153.apk | grep SHA1

   # Base64로 변환 (Kakao용)
   # SHA1 값을 복사해서 https://tomeko.net/online_tools/hex_to_base64.php에서 변환
   ```

5. **Kakao Developers Console에 등록**
   - https://developers.kakao.com
   - 내 애플리케이션 → 앱 설정 → 플랫폼 → Android
   - 키 해시 추가

6. **앱 재설치 및 재시도**
   ```bash
   adb uninstall com.qkrb8019.medsnap
   adb install build-1760028756153.apk
   ```

---

## 💡 **주의사항**

1. **디버그 키 해시 ≠ 릴리즈 키 해시**
   - 개발 중 사용하는 디버그 키는 별도입니다.
   - EAS Build로 만든 APK는 **릴리즈 키**로 서명됩니다.
   - 반드시 **두 개 모두** Kakao 콘솔에 등록해야 합니다!

2. **캐시 문제**
   - 앱을 완전히 삭제 후 재설치하세요.
   - 디바이스 재부팅도 도움이 될 수 있습니다.

3. **Play Store 배포 시**
   - Google Play가 앱을 다시 서명할 수 있습니다.
   - Play Console > Release > Setup > App integrity에서
   - "App signing key certificate" SHA-1을 추가로 등록해야 합니다!

---

## 📞 **추가 도움**

로그를 확인한 후에도 문제가 해결되지 않으면:

1. `release_kakao_debug.log` 파일 공유
2. Kakao Developers Console 스크린샷
3. Google Cloud Console OAuth 설정 스크린샷

이 정보들이 있으면 정확한 원인을 파악할 수 있습니다!
