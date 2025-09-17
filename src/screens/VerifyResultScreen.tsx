import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import StatusContent from '../components/StatusContent';
import PillIcon from '../assets/PillIcon.native';
type ResultCode = 'success' | 'not_taken' | 'error';

type RouteParams = {
  result?: ResultCode; // 없으면 기본적으로 success로 가정
  delayMs?: number; // 분석중 모션 유지 시간 (기본 1200ms)
};

export default function VerifyResultScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();

  /** 화면 상태: 분석중 / 결과 */
  const [phase, setPhase] = useState<'analyzing' | 'done'>('analyzing');
  const [result, setResult] = useState<ResultCode | null>(null);

  const target = route.params?.result ?? 'success';
  const delayMs = route.params?.delayMs ?? 1200;

  // 헤더: 실패/미복용일 때만 X표시 노출
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '복약 인증',
      headerRight:
        phase === 'done' && (result === 'not_taken' || result === 'error')
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
  }, [navigation, phase, result]);

  // 분석중 → 결과 전환 (실제론 API 결과로 바꾸면 됨)
  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      if (!alive) return;
      setResult(target);
      setPhase('done');
    }, delayMs);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [target, delayMs]);

  // 렌더링 분기
  if (phase === 'analyzing') {
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

  // 결과 UI
  if (result === 'success') {
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

  // not_taken / error 공통 실패 UI (문구만 바꾸고 싶으면 분기해서 바꿔도 됨)
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
        onPress: () => navigation.navigate('Camera'), // 카메라 라우트명에 맞게 수정
      }}
    />
  );
}
