import React, { useState, useEffect } from 'react';
import { View, Button, Image, FlatList, Alert, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!hasCameraPermission) {
      Alert.alert('Erro', 'Permissão para acessar a câmera negada.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setImages(prev => [...prev, newImage]);
    }
  };

  const pickImage = async () => {
    if (!hasGalleryPermission) {
      Alert.alert('Erro', 'Permissão para acessar a galeria negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setImages(prev => [...prev, newImage]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Tirar Foto" onPress={takePhoto} />
      <Button title="Selecionar da Galeria" onPress={pickImage} />
      <ScrollView contentContainerStyle={{ marginTop: 10 }}>
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: 100, height: 100, margin: 5}}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Index;
