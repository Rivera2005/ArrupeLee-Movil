import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';

type Props = {
    message: string;
    onDismiss: () => void;
};

const CustomAlert: React.FC<Props> = ({ message, onDismiss }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(1.5)),
            }),
        ]).start();

        const timer = setTimeout(() => {
            hideAlert();
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    const hideAlert = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease),
            }),
            Animated.timing(translateY, {
                toValue: -50,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease),
            }),
        ]).start(() => {
            onDismiss();
        });
    };

    return (
        <Animated.View 
            style={[
                styles.alertContainer, 
                { 
                    opacity, 
                    transform: [{ translateY }] 
                }
            ]}
        >
            <Text style={styles.alertText}>{message}</Text>
            <TouchableOpacity onPress={hideAlert} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    alertContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 18,
        backgroundColor: '#4A148C',  // Un morado más oscuro para contrastar con #673AB7
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
        zIndex: 1000,
        borderWidth: 1,
        borderColor: '#B39DDB',  // Borde suave para definir mejor los límites
    },
    alertText: {
        color: '#E1BEE7',  // Un tono más claro para mejor legibilidad
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    closeButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7E57C2',  // Un tono intermedio para el botón
        borderRadius: 12,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 22,
    },
});

export default CustomAlert;