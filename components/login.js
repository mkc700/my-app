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
import { useUser } from './UserContext';

export default function LoginScreen({ navigation }) {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.brand}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoHeart}>❤</Text>
                    </View>
                    <Text style={styles.brandTitle}>Tinder TEC</Text>
                </View>

                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        // la manera de trabajar los parametros del correo para el async
                        onChangeText={(text)=>setEmail(text)}
                        placeholderTextColor="#9aa0a6"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={password}
                        // la manera de trabajar los parametros de la constraseña para el async
                        onChangeText={(text)=>setPassword(text)}
                        placeholderTextColor="#9aa0a6"
                    />
                    
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
        fontSize: 22,
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
    disabledButton: {
        opacity: 0.6,
    },
});
