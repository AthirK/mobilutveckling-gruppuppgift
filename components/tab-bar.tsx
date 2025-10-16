import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View key={route.name} style={styles.tabbarItem}>
              {options.tabBarButton ? (
                // eslint-disable-next-line react/no-children-prop
                React.createElement(options.tabBarButton, {
                  onPress,
                  onLongPress,
                  accessibilityRole: 'button',
                  accessibilityState: isFocused ? { selected: true } : {},
                  accessibilityLabel: options.tabBarAccessibilityLabel,
                  style: styles.buttonContent,
                  children: options.tabBarIcon?.({
                    focused: isFocused,
                    color: isFocused ? '#873414' : '#957a6dff',
                    size: 28
                  }),
                })
              ) : null}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 10,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBar;