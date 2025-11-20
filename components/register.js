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
} from 'react-native';
import { auth, db } from '../supabase.js';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !confirm) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            // Create user profile
            const userProfile = {
                displayName: name,
                bio: '',
                age: '',
                work: '',
                school: '',
                location: '',
                photos: [],
                interests: [],
            };
            
            const { data, error } = await auth.signUp({ email, password, ...userProfile });

            if (error) {
                throw error;
            }

            navigation.navigate('Welcome');
        } catch (error) {
            console.error('Error al registrar:', error);
            let errorMessage = 'Ocurrió un error al crear la cuenta';

            if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
                errorMessage = 'Este correo electrónico ya está registrado';
            } else if (error.message?.includes('Invalid email') || error.message?.includes('invalid email')) {
                errorMessage = 'Correo electrónico inválido';
            } else if (error.message?.includes('Password') || error.message?.includes('password')) {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            } else if (error.message?.includes('signup is disabled')) {
                errorMessage = 'El registro está temporalmente deshabilitado';
            }

            Alert.alert('Error de registro', errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.brand}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoHeart}>❤</Text>
                    </View>
                    <Text style={styles.brandTitle}>Crear cuenta</Text>
                </View>

                <Text style={styles.subtitle}>Regístrate para empezar</Text>

                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre completo"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#9aa0a6"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#9aa0a6"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#9aa0a6"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar contraseña"
                        secureTextEntry
                        value={confirm}
                        onChangeText={setConfirm}
                        placeholderTextColor="#9aa0a6"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>

                    <View style={styles.row}>
                        <Text style={styles.rowText}>¿Ya tienes una cuenta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}> Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                        <Text style={styles.linkSecondary}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    brand: {
        alignItems: 'center',
        marginBottom: 12,
    },
    logoCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#ff4458',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    logoHeart: {
        color: '#fff',
        fontSize: 30,
        lineHeight: 30,
    },
    brandTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 18,
    },
    card: {
        backgroundColor: '#f8f9fb',
        padding: 18,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    input: {
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e6e9ee',
    },
    button: {
        backgroundColor: '#ff4458',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 6,
        alignItems: 'center',
    },
    rowText: {
        color: '#666',
    },
    link: {
        color: '#ff4458',
        fontWeight: '600',
    },
    linkSecondary: {
        color: '#8a8f96',
        textAlign: 'center',
        marginTop: 12,
    },
});
