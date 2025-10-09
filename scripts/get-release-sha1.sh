#!/bin/bash

# EAS 빌드의 SHA-1을 확인하는 스크립트

echo "🔍 EAS 빌드 SHA-1 확인 중..."
echo ""

# APK 파일 찾기
APK_FILE=$(find . -name "build-*.apk" -type f 2>/dev/null | head -1)

if [ -z "$APK_FILE" ]; then
  echo "❌ APK 파일을 찾을 수 없습니다."
  echo "   eas build -p android --profile production --local 을 먼저 실행하세요."
  exit 1
fi

echo "✅ APK 파일 발견: $APK_FILE"
echo ""

# APK에서 인증서 추출 및 SHA-1 확인
echo "📝 SHA-1 지문:"
echo "----------------------------------------"

# META-INF 디렉토리의 인증서 파일 찾기
CERT_FILE=$(unzip -l "$APK_FILE" 2>/dev/null | grep -o 'META-INF/[^/]*\.RSA' | head -1)

if [ -z "$CERT_FILE" ]; then
  CERT_FILE=$(unzip -l "$APK_FILE" 2>/dev/null | grep -o 'META-INF/[^/]*\.DSA' | head -1)
fi

if [ -z "$CERT_FILE" ]; then
  CERT_FILE=$(unzip -l "$APK_FILE" 2>/dev/null | grep -o 'META-INF/[^/]*\.EC' | head -1)
fi

if [ -n "$CERT_FILE" ]; then
  unzip -p "$APK_FILE" "$CERT_FILE" | keytool -printcert | grep SHA1
  echo ""
  unzip -p "$APK_FILE" "$CERT_FILE" | keytool -printcert | grep SHA256
else
  echo "❌ 서명된 인증서를 찾을 수 없습니다."
  echo ""
  echo "💡 대안: jarsigner로 확인"
  jarsigner -verify -verbose -certs "$APK_FILE" 2>&1 | grep -A2 "SHA1:"
fi

echo ""
echo "----------------------------------------"
echo ""
echo "📌 이 SHA-1을 Google Cloud Console에 등록하세요:"
echo "   https://console.cloud.google.com/"
echo "   → API 및 서비스 → 사용자 인증 정보"
echo "   → OAuth 2.0 클라이언트 ID (Android)"
echo "   → SHA-1 인증서 지문 추가"
echo ""

