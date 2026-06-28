import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Map from '../components/Map';
import MarkerList from '../components/MarkerList';
import { MarkerData, ImageData } from '../types';

export default function HomeScreen() {
  const router = useRouter();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => { //Создание маркера 
    try {
      // Тестовый маркер
      const testMarker: MarkerData = {
        id: '1',
        latitude: 55.7558,
        longitude: 37.6173,
        title: 'Москва',
        description: 'Тестовый маркер',
        images: [],
        createdAt: new Date().toISOString(),
      };
      setMarkers([testMarker]);
    } catch (error) {
      console.error('Ошибка загрузки маркеров:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить маркеры');
    }
  };

  const handleLongPress = (coordinate: { latitude: number; longitude: number }) => {
    Alert.prompt(
      'Новый маркер',
      'Введите название маркера',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Создать',
          onPress: (title) => {
            if (title && title.trim()) {
              createMarker(coordinate, title.trim());
            } else {
              Alert.alert('Ошибка', 'Название маркера не может быть пустым');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const createMarker = async ( //Добавление маркера 
    coordinate: { latitude: number; longitude: number },
    title: string
  ) => {
    setIsLoading(true);
    try {
      const newMarker: MarkerData = {
        id: Date.now().toString(),
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        title: title,
        description: '',
        images: [],
        createdAt: new Date().toISOString(),
      };

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      Alert.alert('Успех', 'Маркер успешно создан');
    } catch (error) {
      console.error('Ошибка создания маркера:', error);
      Alert.alert('Ошибка', 'Не удалось создать маркер');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerPress = (markerId: string) => {
    router.push(`/marker/${markerId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Map
          markers={markers}
          onMarkerPress={handleMarkerPress}
          onLongPress={handleLongPress}
        />
      </View>
      
      <View style={styles.listContainer}>
        <MarkerList
          markers={markers}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: '50%',
  },
  listContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});