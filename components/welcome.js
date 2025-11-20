import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
    return (
        <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.gradient}>
            <View style={styles.container}>
                <View style={styles.hero}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoHeart}>❤</Text>
                    </View>
                    <Text style={styles.title}>Tinder TEC</Text>
                    <Text style={styles.subtitle}>Conecta con estudiantes, comparte intereses y encuentra matches auténticos en el campus.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Tu campus, tu vibra</Text>
                    <Text style={styles.cardText}>Filtra por intereses, eventos y pasiones. Descubre quién comparte tu energía.</Text>
                    <View style={styles.badgeRow}>
                        <Text style={styles.badge}>🎵 Música</Text>
                        <Text style={styles.badge}>⚽ Deportes</Text>
                        <Text style={styles.badge}>💻 Tech</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.registerButton]}
                        onPress={() => navigation.navigate('Register')}>
                        <Text style={[styles.buttonText, styles.registerText]}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 36,
        justifyContent: 'space-between',
    },
    hero: {
        alignItems: 'center',
        marginTop: 24,
    },
    logoCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    logoHeart: {
        fontSize: 40,
        color: '#ff5f6d',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        textAlign: 'center',
        color: '#fff',
        opacity: 0.9,
        lineHeight: 22,
        maxWidth: 320,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
        backdropFilter: 'blur(8px)',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardText: {
        color: '#fefefe',
        opacity: 0.9,
        marginBottom: 16,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        color: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        fontWeight: '600',
        fontSize: 12,
    },
    buttonContainer: {
        gap: 14,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 26,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    registerButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    buttonText: {
        color: '#ff4458',
        fontSize: 16,
        fontWeight: '700',
    },
    registerText: {
        color: '#fff',
    },
});