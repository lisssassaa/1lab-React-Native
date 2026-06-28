import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ImageList from '../../components/ImageList';
import { MarkerData, ImageData } from '../../types';

export default function MarkerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [marker, setMarker] = useState<MarkerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadMarker();
  }, [id]);

  const loadMarker = async () => {
    setIsLoading(true);
    try {
      const testMarker: MarkerData = {
        id: id as string,
        latitude: 55.7558,
        longitude: 37.6173,
        title: 'Москва',
        description: 'Тестовый маркер в Москве',
        images: [
          {
            id: '1',
            uri: 'https://via.placeholder.com/150',
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setMarker(testMarker);
    } catch (error) {
      console.error('Ошибка загрузки маркера:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные маркера');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = async () => {  //Запрос разрешения на доступ к галерее
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Доступ запрещен',
          'Для добавления изображений необходимо разрешение на доступ к галерее'
        );
        return;
      }
  //Открытие галереи
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8, // Сжатие (80% качества)
      });
//  Добавление выбранного изображения
      if (!result.canceled && result.assets[0]) {
        const newImage: ImageData = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          createdAt: new Date().toISOString(),
        };

        setIsSaving(true);
        setMarker((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            images: [...prev.images, newImage],
          };
        });
        Alert.alert('Успех', 'Изображение добавлено');
      }
    } catch (error) {
      console.error('Ошибка при выборе изображения:', error);
      Alert.alert('Ошибка', 'Не удалось добавить изображение');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteImage = (imageId: string) => { //удаление изображения
    setMarker((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      };
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
      </View>
    );
  }

  if (!marker) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Маркер не найден</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Вернуться на карту</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Детали маркера</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Убираем ScrollView, используем только FlatList через ImageList */}
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.title}>{marker.title}</Text>
          <Text style={styles.coordinates}>
            ★ {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
          </Text>
          {marker.description && (
            <Text style={styles.description}>{marker.description}</Text>
          )}
          <Text style={styles.createdAt}>
            Создан: {new Date(marker.createdAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.imagesSection}>
          <ImageList
            images={marker.images}
            onDeleteImage={handleDeleteImage}
            onAddImage={handleAddImage}
          />
        </View>
      </View>

      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Сохранение...</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 14,
    color: '#999',
  },
  imagesSection: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    marginBottom: 20,
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