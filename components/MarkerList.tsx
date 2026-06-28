import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MarkerData, MarkerListProps } from '../types';

const MarkerList: React.FC<MarkerListProps> = ({ markers, onMarkerPress }) => {
  const renderMarkerItem = ({ item }: { item: MarkerData }) => (
    <TouchableOpacity
      style={styles.markerItem}
      onPress={() => onMarkerPress(item.id)}
    >
      <View style={styles.markerInfo}>
        <Text style={styles.markerTitle}>{item.title}</Text>
        <Text style={styles.markerSubtitle}>
          {item.images.length} изображений • 
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.description && (
          <Text style={styles.markerDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.markerIcon}>
        <Text>{item.images.length > 0 ? '☆' : '★'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (markers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Нет добавленных маркеров
        </Text>
        <Text style={styles.emptySubtext}>
          Нажмите и удерживайте на карте, чтобы добавить маркер
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={markers}
        renderItem={renderMarkerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  markerItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  markerInfo: {
    flex: 1,
  },
  markerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  markerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  markerDescription: {
    fontSize: 14,
    color: '#888',
  },
  markerIcon: {
    marginLeft: 12,
    fontSize: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default MarkerList;