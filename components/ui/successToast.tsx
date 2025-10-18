import { View, Text, StyleSheet } from 'react-native';

interface SuccessToastProps {
  visible: boolean;
  message: string;
}

export const SuccessToast = ({
  visible,
  message
}: SuccessToastProps) => {
  if (!visible) return null;

  return (
    <View style={styles.successToast}>
      <Text style={styles.successText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  successToast: {
    position: 'absolute',
    top: 300,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  successText: {
    color: '#fff',
    fontWeight: '600',
  },
});