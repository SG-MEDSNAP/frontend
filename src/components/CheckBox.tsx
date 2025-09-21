import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from './Icon';

interface CheckBoxProps {
  checked: boolean;
  onPress: (checked: boolean) => void;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export default function CheckBox({
  checked,
  onPress,
  size = 24,
  disabled = false,
  className,
}: CheckBoxProps) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress(!checked)}
      disabled={disabled}
      className={className}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#C2C2C2',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && (
          <Icon
            name="check"
            size={size * 0.6}
            color="#232323"
            strokeWidth={2}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

// 사용 예시:
// const [isChecked, setIsChecked] = useState(false);
// <CheckBox checked={isChecked} onPress={setIsChecked} />
