import React, { useEffect, useLayoutEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import StatusContent from '../components/StatusContent';
import PillIcon from '../assets/PillIcon.native';
import { useVerifyMedicationMutation } from '../api/medication/mutations';

type ResultCode = 'success' | 'not_taken' | 'error';

type RouteParams = {
  imageUri: string; // 촬영된 이미지 URI
  recordId: number; // 복약 기록 ID
  result?: ResultCode; // 테스트용 결과 코드 (실제 API 연동 시에는 사용하지 않음)
  delayMs?: number; // 분석중 모션 유지 시간 (기본 1200ms)
};

export default function VerifyResultScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();

  // 이미지 URI와 레코드 ID를 가져옴
  const imageUri = route.params?.imageUri;
  const recordId = route.params?.recordId;

  // 테스트용 (API 연동이 없을 때 사용)
  const target = route.params?.result ?? 'success';
  const delayMs = route.params?.delayMs ?? 1200;

  // 복약 인증 mutation 훅
  const verifyMutation = useVerifyMedicationMutation();
  const {
    mutate,
    isPending: isLoading,
    isSuccess,
    isError,
    data,
  } = verifyMutation;

  // 헤더: 실패/미복용일 때만 X표시 노출
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '복약 인증',
      headerRight:
        !isLoading && ((isSuccess && data?.status !== 'TAKEN') || isError)
          ? () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                hitSlop={10}
              >
                <Text className="text-xl">✕</Text>
              </TouchableOpacity>
            )
          : undefined,
    });
  }, [navigation, isLoading, isSuccess, isError, data]);

  // 복약 인증 API 호출 (한 번만 실행)
  useEffect(() => {
    // recordId와 imageUri가 있는 경우에만 mutation 실행
    if (recordId && imageUri) {
      mutate({ recordId, imageUri });
    }
  }, []);

  // 테스트용: API 연동이 없는 경우
  const [testResult, setTestResult] = React.useState<ResultCode | null>(null);

  useEffect(() => {
    // recordId나 imageUri가 없는 경우, 테스트 모드로 실행
    if (!recordId || !imageUri) {
      const timer = setTimeout(() => {
        setTestResult(target);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, []);

  // 로딩 중 (분석 중)
  if (isLoading || (!isSuccess && !isError && !testResult)) {
    return (
      <StatusContent
        icon={
          <PillIcon
            className="w-[79px] h-[60px] text-[#597AFF]"
            color="currentColor"
          />
        }
        title="사진을 분석중입니다"
        subtitle="조금만 기다려주세요!"
        // 분석중에는 버튼 없음
      />
    );
  }

  // 테스트 결과 UI 처리
  if (testResult) {
    if (testResult === 'success') {
      return (
        <StatusContent
          icon={
            <PillIcon
              className="w-[79px] h-[60px] text-[#597AFF]"
              color="currentColor"
            />
          }
          title="사진 분석이 완료되었습니다"
          subtitle="약을 잘 챙겨드셨어요. 다음 복용도 응원할게요!"
          primaryAction={{
            label: '확인',
            onPress: () => navigation.goBack(),
          }}
        />
      );
    } else if (testResult === 'not_taken') {
      return (
        <StatusContent
          icon={
            <PillIcon
              className="w-[79px] h-[60px] text-[#597AFF]"
              color="currentColor"
            />
          }
          title="사진 분석이 완료되었습니다"
          subtitle="앗, 아직 약을 안 드셨어요! 복용하신 뒤 다시 사진을 찍어주세요."
          tone="error"
          primaryAction={{
            label: '촬영하기',
            onPress: () => navigation.goBack(),
          }}
        />
      );
    } else {
      // 테스트 에러 UI
      return (
        <StatusContent
          icon={
            <PillIcon
              className="w-[79px] h-[60px] text-[#597AFF]"
              color="currentColor"
            />
          }
          title="사진 분석 중 오류가 발생했습니다"
          subtitle="네트워크 연결을 확인하고 다시 시도해주세요."
          tone="error"
          primaryAction={{
            label: '다시 시도하기',
            onPress: () => navigation.goBack(),
          }}
        />
      );
    }
  }

  // 성공했을 때
  if (isSuccess && data?.status === 'TAKEN') {
    return (
      <StatusContent
        icon={
          <PillIcon
            className="w-[79px] h-[60px] text-[#597AFF]"
            color="currentColor"
          />
        }
        title="사진 분석이 완료되었습니다"
        subtitle="약을 잘 챙겨드셨어요. 다음 복용도 응원할게요!"
        primaryAction={{
          label: '확인',
          onPress: () => navigation.goBack(),
        }}
      />
    );
  }

  // 약을 먹지 않은 경우 (PENDING, SKIPPED)
  if (isSuccess && (data?.status === 'PENDING' || data?.status === 'SKIPPED')) {
    return (
      <StatusContent
        icon={
          <PillIcon
            className="w-[79px] h-[60px] text-[#597AFF]"
            color="currentColor"
          />
        }
        title="사진 분석이 완료되었습니다"
        subtitle="앗, 아직 약을 안 드셨어요! 복용하신 뒤 다시 사진을 찍어주세요."
        tone="error"
        primaryAction={{
          label: '촬영하기',
          onPress: () => navigation.goBack(), // 이전 화면으로 돌아가서 다시 촬영
        }}
      />
    );
  }

  // 에러 발생했을 때
  return (
    <StatusContent
      icon={
        <PillIcon
          className="w-[79px] h-[60px] text-[#597AFF]"
          color="currentColor"
        />
      }
      title="사진 분석 중 오류가 발생했습니다"
      subtitle="네트워크 연결을 확인하고 다시 시도해주세요."
      tone="error"
      primaryAction={{
        label: '다시 시도하기',
        onPress: () => navigation.goBack(), // 이전 화면으로 돌아가서 다시 촬영
      }}
    />
  );
}
