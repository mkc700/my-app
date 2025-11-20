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
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../supabase.js';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.gradient}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'padding'}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={styles.brand}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoHeart}>❤</Text>
                        </View>
                        <Text style={styles.brandTitle}>Crea tu perfil</Text>
                        <Text style={styles.subtitle}>Únete a la comunidad Tinder TEC y comparte tu vibra con estudiantes del campus.</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Información básica</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre completo"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#c7c7d0"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#c7c7d0"
                        />

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Contraseña"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor="#c7c7d0"
                            />
                            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                                <Text style={styles.toggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Confirmar contraseña"
                                secureTextEntry={!showConfirmPassword}
                                value={confirm}
                                onChangeText={setConfirm}
                                placeholderTextColor="#c7c7d0"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
                                <Text style={styles.toggleText}>{showConfirmPassword ? 'Ocultar' : 'Mostrar'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.helperText}>Usa al menos 6 caracteres. Puedes actualizar tu perfil después.</Text>

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Crear cuenta</Text>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <Text style={styles.rowText}>¿Ya tienes cuenta?</Text>
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
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingBottom: 48,
    },
    brand: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    logoHeart: {
        color: '#ff5f6d',
        fontSize: 32,
        lineHeight: 32,
    },
    brandTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        textAlign: 'center',
        color: '#ffeef3',
        marginTop: 8,
        marginBottom: 14,
        lineHeight: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 20,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
    input: {
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    passwordInput: {
        flex: 1,
        borderWidth: 0,
        marginBottom: 0,
        paddingHorizontal: 4,
    },
    toggleText: {
        color: '#ff5f6d',
        fontWeight: '600',
        paddingHorizontal: 8,
    },
    helperText: {
        color: '#ffeef3',
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonText: {
        color: '#ff4458',
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
        color: '#ffeef3',
    },
    link: {
        color: '#fff',
        fontWeight: '600',
    },
    linkSecondary: {
        color: '#ffe0ec',
        textAlign: 'center',
        marginTop: 12,
    },
});
