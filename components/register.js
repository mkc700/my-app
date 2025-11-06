import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView,KeyboardAvoidingView,Platform } from "react-native";
import { authService } from '../Service/authService';
import { Alert } from 'react-native';
import { Image } from "react-native";

export default function Register({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register Screen</Text>
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