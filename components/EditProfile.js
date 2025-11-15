import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase, PROFILE_IMAGES_BUCKET } from '../supabase';
import { useUser } from './UserContext';

export default function EditProfileScreen({ navigation }) {
  const { userProfile, updateProfile } = useUser();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [work, setWork] = useState('');
  const [school, setSchool] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Update state when userProfile loads
  React.useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setBio(userProfile.bio || '');
      setAge(userProfile.age || '');
      setWork(userProfile.work || '');
      setSchool(userProfile.school || '');
      setLocation(userProfile.location || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    setLoading(true);
    try {
      let photoUrl = null;
      if (selectedImage) {
        photoUrl = await uploadImage(selectedImage);
      }

      const updates = {
        displayName: displayName.trim(),
        bio: bio.trim(),
        age: age.trim(),
        work: work.trim(),
        school: school.trim(),
        location: location.trim(),
      };

      if (photoUrl) {
        updates.photos = [photoUrl, ...(userProfile?.photos?.slice(1) || [])];
      }

      await updateProfile(updates);

      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para seleccionar una foto');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const uploadImage = async (image) => {
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const filename = `profile_${userProfile.uid}_${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from(PROFILE_IMAGES_BUCKET)
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(PROFILE_IMAGES_BUCKET)
        .getPublicUrl(filename);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Show loading if userProfile is not loaded yet
  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4458" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Editar Perfil</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveButton, loading && { opacity: 0.5 }]}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Foto de perfil</Text>
            <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
              <Image
                source={{
                  uri: selectedImage?.uri || userProfile?.photos?.[0] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
                }}
                style={styles.photo}
              />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoText}>Cambiar foto</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo *</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Tu nombre completo"
              placeholderTextColor="#9aa0a6"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntanos sobre ti..."
              placeholderTextColor="#9aa0a6"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Edad</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Tu edad"
              placeholderTextColor="#9aa0a6"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trabajo</Text>
            <TextInput
              style={styles.input}
              value={work}
              onChangeText={setWork}
              placeholder="Tu ocupación"
              placeholderTextColor="#9aa0a6"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Escuela/Universidad</Text>
            <TextInput
              style={styles.input}
              value={school}
              onChangeText={setSchool}
              placeholder="Dónde estudias"
              placeholderTextColor="#9aa0a6"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ubicación</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Tu ciudad o ubicación"
              placeholderTextColor="#9aa0a6"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e2e6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    color: '#ff4458',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#f8f9fb',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e6e9ee',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ff4458',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
