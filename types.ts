// types.ts
export interface ImageData {
  id: string;
  uri: string;
  createdAt: string;
}

export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  images: ImageData[];
  createdAt: string;
}

export interface MarkerFormData {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
}

export type RootStackParamList = {
  index: undefined;
  'marker/[id]': { markerId: string };
};

export interface MapProps {
  markers: MarkerData[];
  onMarkerPress: (markerId: string) => void;
  onLongPress: (coordinate: { latitude: number; longitude: number }) => void;
}

export interface MarkerListProps {
  markers: MarkerData[];
  onMarkerPress: (markerId: string) => void;
}

export interface ImageListProps {
  images: ImageData[];
  onDeleteImage: (imageId: string) => void;
  onAddImage: () => void;
}