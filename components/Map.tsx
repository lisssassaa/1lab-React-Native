import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import MapView, { Marker, Region, MapPressEvent } from 'react-native-maps';
import { MarkerData, MapProps } from '../types';

//начальная позиция - Москва
const Map: React.FC<MapProps> = ({ markers, onMarkerPress, onLongPress }) => {
  const [region, setRegion] = useState<Region>({
    latitude: 55.7558, //координаты
    longitude: 37.6173,
    latitudeDelta: 0.0922, //Масштаб
    longitudeDelta: 0.0421,
  });

  const handleLongPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    onLongPress(coordinate);
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleMarkerPress = (markerId: string) => {
    onMarkerPress(markerId);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        onLongPress={handleLongPress} //Долгое нажатие 
        showsUserLocation={true} //Показывать местоположение 
        showsMyLocationButton={true}
      >
        {markers.map((marker) => ( //Маркеры 
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title} //Заголовок 
            description={marker.description} //Описание 
            onPress={() => handleMarkerPress(marker.id)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Text style={styles.markerText}>
                  {marker.images.length > 0 ? '☆' : '★'}
                </Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 16,
    color: 'white',
  },
});

export default Map;