import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

// Icons that don't have SF Symbol equivalents
const COMMUNITY_ICONS = ['mushroom'] as const;
type CommunityIconName = typeof COMMUNITY_ICONS[number];

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'] | CommunityIconName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle | TextStyle>;
  weight?: SymbolWeight;
}) {
  // Use MaterialCommunityIcons for icons without SF Symbol equivalents
  if (COMMUNITY_ICONS.includes(name as CommunityIconName)) {
    return <MaterialCommunityIcons name={name as any} size={size} color={color} style={style as StyleProp<TextStyle>} />;
  }

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name as SymbolViewProps['name']}
      style={[
        {
          width: size,
          height: size,
        },
        style as StyleProp<ViewStyle>,
      ]}
    />
  );
}