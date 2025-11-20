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
import { useUser } from './UserContext';

export default function LoginScreen({ navigation }) {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async() => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        try {
            console.log('Intentando login con:', email);
            await login(email, password);

            console.log('Login exitoso');
            // No navegamos manualmente, el UserContext debería detectar el cambio
            Alert.alert('¡Éxito!', 'Iniciando sesión...');

        } catch (error) {
            console.error('Error completo de login:', error);
            let errorMessage = 'Correo o contraseña incorrectos';

            if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid_credentials')) {
                errorMessage = 'Correo o contraseña incorrectos';
            } else if (error.message?.includes('Email not confirmed')) {
                errorMessage = 'Por favor confirma tu correo electrónico';
            } else if (error.message?.includes('Too many requests')) {
                errorMessage = 'Demasiados intentos. Intenta más tarde';
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('Error de inicio de sesión', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.gradient}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'android' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={styles.brand}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoHeart}>❤</Text>
                        </View>
                        <Text style={styles.brandTitle}>Tinder TEC</Text>
                        <Text style={styles.subtitle}>Inicia sesión para seguir explorando matches en el campus.</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Hola de nuevo 👋</Text>
                        <Text style={styles.cardSubtitle}>Ingresa tus datos para continuar.</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(text)=>setEmail(text)}
                            placeholderTextColor="#c7c7d0"
                        />

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="Contraseña"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={(text)=>setPassword(text)}
                                placeholderTextColor="#c7c7d0"
                            />
                            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                                <Text style={styles.toggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity
                            style={[styles.button, loading && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.row}>
                            <Text style={styles.rowText}>¿Aún no tienes cuenta?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.link}> Regístrate</Text>
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
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    logoHeart: {
        color: '#ff5f6d',
        fontSize: 30,
        lineHeight: 30,
    },
    brandTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
    },
    subtitle: {
        textAlign: 'center',
        color: '#ffeef3',
        marginTop: 6,
        marginBottom: 10,
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
        marginBottom: 4,
    },
    cardSubtitle: {
        color: '#fefefe',
        opacity: 0.85,
        marginBottom: 16,
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
    button: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 10,
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
    disabledButton: {
        opacity: 0.6,
    },
});
