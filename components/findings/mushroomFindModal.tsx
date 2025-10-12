import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MushroomCatch } from '@/types/mushroom.types';
import { LocationDisplay } from '@/components/location/locationDisplay';

interface MushroomFindModalProps {
  visible: boolean;
  mushroom: MushroomCatch | null;
  onClose: () => void;
}

export const MushroomFindModal = ({ visible, mushroom, onClose }: MushroomFindModalProps) => {
  if (!mushroom) return null;

  const formattedDateTime = `${new Date(mushroom.timestamp).toLocaleDateString('sv-SE')}, ${new Date(mushroom.timestamp).toLocaleTimeString('sv-SE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{mushroom.name}</Text>
          
          <Image 
            source={{ uri: mushroom.imageUri }} 
            style={styles.image}
          />
          
          <View style={styles.details}>
            <Text style={styles.detailText}>
              📅 {formattedDateTime}
            </Text>
            
            <View style={styles.locationContainer}>
              {mushroom.isFallbackLocation ? (
                <Text style={[styles.locationText, styles.fallbackText]}>
                  No GPS-data available
                </Text>
              ) : (
                <LocationDisplay
                  locationLoading={false}
                  currentLocation={mushroom.location}
                  isFallbackLocation={false}
                  style={styles.locationText}
                />
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  image: {
    width: '90%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  details: {
    width: '90%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  locationContainer: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  fallbackText: {
    fontStyle: 'italic',
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
});