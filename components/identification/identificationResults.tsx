import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface IdentificationResultsProps {
  loading: boolean;
  children: React.ReactNode;
}

export const IdentificationResults = ({
  loading,
  children
}: IdentificationResultsProps) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Identifying...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
});