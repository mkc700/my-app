import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a Tinder TEC</Text>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#ff4458', // Color rojo de Tinder
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        backgroundColor: '#ff4458',
        padding: 15,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    registerButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ff4458',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerText: {
        color: '#ff4458',
    }
});