import { View, Pressable, Text, StyleSheet } from 'react-native';

interface ImagePickerProps {
  onTakePhoto: () => void;
  onPickImage: () => void;
  onIdentify: () => void;
  loading: boolean;
  hasImage: boolean;
}

export const ImagePicker = ({
  onTakePhoto,
  onPickImage,
  onIdentify,
  loading,
  hasImage
}: ImagePickerProps) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={[styles.button, styles.cameraButton]} onPress={onTakePhoto}>
        <Text style={styles.buttonText}>📸 Camera</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.galleryButton]} onPress={onPickImage}>
        <Text style={styles.buttonText}>🖼️ Gallery</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.identifyButton,
          (loading || !hasImage) && styles.disabledButton
        ]}
        onPress={onIdentify}
        disabled={loading || !hasImage}
      >
        <Text style={styles.buttonText}>🔍 Identify</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    flex: 1,
    maxWidth: 95,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
  },
  galleryButton: {
    backgroundColor: '#2196F3',
  },
  identifyButton: {
    backgroundColor: '#FF9800',
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});