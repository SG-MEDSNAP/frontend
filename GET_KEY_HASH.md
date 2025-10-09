# 🔑 릴리즈 APK 키 해시 확인 방법

## 문제 상황

- 릴리즈 APK를 설치했지만 키 해시 팝업이 뜨지 않음
- Expo 프로젝트에서 커스텀 네이티브 모듈은 prebuild 시 삭제됨

---

## ✅ 해결 방법 1: EAS Build Credentials 직접 확인

### 1단계: EAS 키스토어 정보 조회

```bash
eas credentials
```

프롬프트에서:

1. `Android` 선택
2. `production` 프로파일 선택
3. `Keystore: Manage everything...` 선택
4. `Download Keystore` 선택

### 2단계: 다운로드한 키스토어에서 키 해시 추출

```bash
# 키스토어 정보 확인
keytool -list -v -keystore ./downloaded-keystore.jks

# Kakao 키 해시 생성 (Base64)
keytool -exportcert -alias [YOUR_ALIAS] -keystore ./downloaded-keystore.jks | openssl sha1 -binary | openssl base64

# Google SHA-1 지문 확인 (위 명령어 결과에서 SHA1 찾기)
```

---

## ✅ 해결 방법 2: APK에서 직접 추출

```bash
# APK 파일 찾기
find . -name "*.apk" -type f | grep -v node_modules

# APK 인증서 정보 확인
unzip -p ./build-xxxxx.apk META-INF/*.RSA | keytool -printcert | grep SHA1

# 또는 jarsigner로 확인
jarsigner -verify -verbose -certs ./build-xxxxx.apk | grep SHA1
```

---

## ✅ 해결 방법 3: Google Play Console 이용 (가장 쉬움!)

1. Google Play Console에 APK 업로드 (테스트 트랙도 가능)
2. **Release > Setup > App integrity** 메뉴 이동
3. **App signing** 섹션에서 자동 생성된 SHA-1 확인
4. 이 SHA-1을 Kakao/Google 개발자 콘솔에 등록

---

## 📝 등록해야 할 곳

### Kakao Developers Console

1. https://developers.kakao.com 접속
2. 내 애플리케이션 → 앱 선택
3. **플랫폼** → **Android 플랫폼 등록 및 수정**
4. **키 해시** 추가 (Base64 형식)

### Google Cloud Console

1. https://console.cloud.google.com 접속
2. 프로젝트 선택
3. **API 및 서비스** → **사용자 인증 정보**
4. **OAuth 2.0 클라이언트 ID (Android)** 선택
5. **SHA-1 인증서 지문** 추가

---

## 🎯 빠른 해결 방법 (권장)

**가장 빠르고 정확한 방법:**

```bash
# 1. EAS credentials 정보 출력
npx eas-cli credentials:list

# 2. 키스토어 다운로드 (자동으로 현재 디렉토리에 저장)
npx eas-cli credentials:download

# 3. Kakao 키 해시 생성
keytool -exportcert -alias [표시된_alias] -keystore ./build-credentials.jks | openssl sha1 -binary | openssl base64

# 4. Google SHA-1 확인
keytool -list -v -keystore ./build-credentials.jks | grep SHA1
```

비밀번호는 EAS가 자동 생성한 것을 사용하거나, credentials 조회 시 표시됩니다.

---

## 💡 참고

- **디버그 키 해시**: 개발 중 사용 (이미 등록됨)
- **릴리즈 키 해시**: 프로덕션 빌드용 (새로 등록 필요)
- 두 키 해시 모두 Kakao/Google 콘솔에 등록해야 함
- Play Store 업로드 시 Google이 추가로 재서명하므로, Play Store용 SHA-1도 별도 등록 필요

---

## 🚀 최종 확인

등록 후:

1. 앱 재설치 (캐시 제거)
2. 카카오/구글 로그인 시도
3. 정상 작동 확인

문제가 계속되면:

- Kakao 콘솔에서 키 해시가 정확히 입력되었는지 확인
- Google 콘솔에서 패키지명이 `com.qkrb8019.medsnap`과 일치하는지 확인
- 앱을 완전히 삭제 후 재설치
