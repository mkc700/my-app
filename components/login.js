import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView,KeyboardAvoidingView,Platform } from "react-native";
import { Alert } from 'react-native';
import { Image } from "react-native";

export default function LoginScreen ({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Screen</Text>
              <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('Welcome')}>
                                <Text style={styles.buttonText}>Regresar a cuenta</Text>
                            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
});