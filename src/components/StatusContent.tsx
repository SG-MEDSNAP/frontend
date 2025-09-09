import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from './Button'

type Action = {
  label: string
  onPress: () => void
  disabled?: boolean
  variant?: 'primary' | 'ghost'
  testID?: string
}

type Props = {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  tone?: 'default' | 'error'
  primaryAction?: Action
  secondaryAction?: Action
  fullHeight?: boolean
  footerSlot?: React.ReactNode
  testID?: string
}

export default function duStatusContent({
  icon,
  title,
  subtitle,
  tone = 'default',
  primaryAction,
  secondaryAction,
  fullHeight = true,
  footerSlot,
  testID,
}: Props) {
  const subColor = tone === 'error' ? 'text-red-500' : 'text-gray-500'
  const normalizedTitle = useMemo(
    () => (title ? title.replace(/\\n/g, '\n') : title),
    [title]
  )
  const normalizedSubtitle = useMemo(
    () => (subtitle ? subtitle.replace(/\\n/g, '\n') : subtitle),
    [subtitle]
  )

  return (
    <View className="flex-1 w-full">
 
      <View
        className={[
          'flex-1 px-6 items-center',
          fullHeight ? 'justify-center' : '',
        ].join(' ')}
        testID={testID}
      >
        {icon ? <View className="mb-4">{icon}</View> : null}

        <Text className="text-[30px] font-bold text-gray-900 text-center">
          {normalizedTitle}
        </Text>

        {normalizedSubtitle ? (
          <Text className={`mt-2 text-center leading-6 ${subColor}`}>
            {normalizedSubtitle}
          </Text>
        ) : null}
      </View>

 
      <SafeAreaView edges={['bottom']} className="w-full px-6 pb-4">
        {primaryAction && (
          <Button
            title={primaryAction.label}
            type="primary"        
            size="lg"           
            onPress={primaryAction.onPress}
            disabled={primaryAction.disabled}
            className="w-full"
            textClassName="text-[18px]" 
          />
        )}

        {secondaryAction && (
          <View className="mt-3">
            <Button
              title={secondaryAction.label}
              type={secondaryAction.variant === 'primary' ? 'primary' : 'secondary'}
              size="lg"
              onPress={secondaryAction.onPress}
              disabled={secondaryAction.disabled}
              className="w-full"
              textClassName="text-[18px]"
            />
          </View>
        )}

        {footerSlot ? <View className="mt-4">{footerSlot}</View> : null}
      </SafeAreaView>
    </View>
  )
}
